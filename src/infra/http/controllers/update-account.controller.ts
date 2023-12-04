import {
  // BadRequestException,
  Body,
  Controller,
  Injectable,
  Put,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { CurrentUser } from 'src/infra/auth/current-user-decorator';
import { UserPayload } from 'src/infra/auth/jwt.strategy';
// import { errors } from '../errors';

const updateAccountBodySchema = z.object({
  address: z
    .object({
      cep: z.string().length(8),
      address: z.string().min(1),
      address_identifier: z.string().min(1),
      complement: z.string(),
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
  async handle(
    @Body() body: UpdateAccountBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { address } = body;

    return { address, user };
  }
}
