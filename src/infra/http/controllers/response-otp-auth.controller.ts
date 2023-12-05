import {
  Body,
  Controller,
  Injectable,
  Post,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/infra/pipes/zod-validation-pipe';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { Public } from '../../auth/public';
import { errors } from '../errors';
import { JwtEncrypter } from '@/infra/cryptography/jwt-encrypter';

const responseOtpAuthBodySchema = z.object({
  accountId: z.string().uuid(),
  code: z.number().int(),
});

type ResponseOtpAuthBodySchema = z.infer<typeof responseOtpAuthBodySchema>;

@Injectable()
@Public()
@Controller('/auth/response-otp')
export class ResponseOtpAuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encrypter: JwtEncrypter,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(responseOtpAuthBodySchema))
  async handle(@Body() body: ResponseOtpAuthBodySchema) {
    const account = await this.prisma.account.findUnique({
      where: { id: body.accountId },
      include: {
        address: true,
      },
    });

    if (!account) {
      throw new BadRequestException({
        code: errors.resourceNotFound,
        msg: 'accountId does not exists',
      });
    }

    if (body.code !== 123456) {
      throw new BadRequestException({
        code: errors.wrongOtpCode,
        msg: 'invalid otp code',
      });
    }

    const accessToken = await this.encrypter.encrypt({
      sub: body.accountId,
    });

    return { account, accessToken };
  }
}
