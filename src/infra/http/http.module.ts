import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account.controller';
import { PrismaService } from '../database/prisma/prisma.service';
import { UpdateAccountController } from './controllers/update-account.controller';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { RequestOtpAuthController } from './controllers/request-otp-auth.controller';
import { ResponseOtpAuthController } from './controllers/response-otp-auth.controller';
import { FindProductsController } from './controllers/find-products.controller';
import { CreateListController } from './controllers/create-list.controller';
import { UpdateListController } from './controllers/update-list.controller';
import { FindListsController } from './controllers/find-lists.controller';

@Module({
  imports: [CryptographyModule],
  controllers: [
    CreateAccountController,
    UpdateAccountController,
    RequestOtpAuthController,
    ResponseOtpAuthController,
    FindProductsController,
    CreateListController,
    UpdateListController,
    FindListsController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
