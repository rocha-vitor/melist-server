import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account.controller';
import { PrismaService } from '../database/prisma/prisma.service';
import { UpdateAccountController } from './controllers/update-account.controller';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { RequestOtpAuthController } from './controllers/request-otp-auth.controller';
import { ResponseOtpAuthController } from './controllers/response-otp-auth.controller';
import { FindProductsController } from './controllers/find-products.controller';

@Module({
  imports: [CryptographyModule],
  controllers: [
    CreateAccountController,
    UpdateAccountController,
    RequestOtpAuthController,
    ResponseOtpAuthController,
    FindProductsController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
