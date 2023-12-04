import {
  BadRequestException,
  Body,
  Controller,
  Injectable,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { errors } from '../errors';
import { Public } from '../../auth/public';

const createAccountBodySchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Injectable()
@Public()
@Controller('/accounts')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, phone } = body;

    const accountAlreadyExists = await this.prisma.account.findUnique({
      where: { phone },
    });

    if (accountAlreadyExists) {
      throw new BadRequestException({
        code: errors.resourceAlreadyExists,
        msg: 'the phone number already exists',
      });
    }

    const account = await this.prisma.account.create({
      data: {
        name,
        phone,
      },
    });

    return account;
  }
}
