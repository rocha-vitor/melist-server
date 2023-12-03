import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account.controller';

@Module({
  imports: [],
  controllers: [CreateAccountController],
  providers: [],
})
export class HttpModule {}
