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
  accountId: z.string().uuid(),
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
      where: { id: body.accountId },
    });

    if (!accountExists) {
      throw new BadRequestException({
        code: errors.resourceNotFound,
        msg: 'accountId does not exists',
      });
    }

    // default otp 123456
  }
}
