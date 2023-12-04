import { Module } from '@nestjs/common';

import { JwtEncrypter } from './jwt-encrypter';
import { BcryptHasher } from './bcrypt-hasher';

@Module({
  providers: [JwtEncrypter, BcryptHasher, BcryptHasher],
  exports: [JwtEncrypter, BcryptHasher, BcryptHasher],
})
export class CryptographyModule {}
