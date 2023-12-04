import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { EnvService } from '../env/env.service';
import { EnvModule } from '../env/env.module';
import { envs } from '../envs';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory() {
        return {
          signOptions: { algorithm: 'RS256', expiresIn: 604800 },
          privateKey: envs.JWT_PRIVATE_KEY,
          publicKey: envs.JWT_PUBLIC_KEY,
        };
      },
    }),
  ],
  providers: [
    JwtStrategy,
    EnvService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
