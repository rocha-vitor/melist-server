import {
  // BadRequestException,
  Body,
  Controller,
  Injectable,
  Put,
  UsePipes,
  Request,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
// import { errors } from '../errors';

const updateAccountBodySchema = z.object({
  address: z
    .object({
      cep: z.string().length(8),
      state: z.string().length(2).toUpperCase(),
      city: z.string().min(1),
      address: z.string().min(1),
      address_identifier: z.string().min(1),
      complement: z.string().optional(),
    })
    .optional(),
});

type UpdateAccountBodySchema = z.infer<typeof updateAccountBodySchema>;

@Injectable()
@Controller('/accounts')
export class UpdateAccountController {
  constructor(private readonly prisma: PrismaService) {}

  @Put()
  @UsePipes(new ZodValidationPipe(updateAccountBodySchema))
  async handle(@Request() request: any, @Body() body: UpdateAccountBodySchema) {
    const { sub } = request.user;
    const { address } = body;

    const accountUpdated = await this.prisma.account.update({
      where: {
        id: sub,
      },
      data: {
        address: address
          ? {
              upsert: {
                create: address,
                update: address,
              },
            }
          : undefined,
      },
      include: { address: true },
    });

    return { account: accountUpdated };
  }
}
