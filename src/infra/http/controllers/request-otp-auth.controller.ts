import {
  Body,
  Controller,
  Injectable,
  Post,
  UsePipes,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { Public } from '../../auth/public';
import { errors } from '../errors';

const requestOtpAuthBodySchema = z.object({
  phone: z.string().min(1),
});

type RequestOtpAuthBodySchema = z.infer<typeof requestOtpAuthBodySchema>;

@Injectable()
@Public()
@Controller('/auth/request-otp')
export class RequestOtpAuthController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(requestOtpAuthBodySchema))
  async handle(@Body() body: RequestOtpAuthBodySchema) {
    const accountExists = await this.prisma.account.findUnique({
      where: { phone: body.phone },
    });

    if (!accountExists) {
      throw new BadRequestException({
        code: errors.resourceNotFound,
        msg: 'account does not exists',
      });
    }

    // default otp 123456
  }
}
