import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account.controller';
import { PrismaService } from '../database/prisma/prisma.service';
import { UpdateAccountController } from './controllers/update-account.controller';
import { CryptographyModule } from '../cryptography/cryptography.module';

@Module({
  imports: [CryptographyModule],
  controllers: [CreateAccountController, UpdateAccountController],
  providers: [PrismaService],
})
export class HttpModule {}
