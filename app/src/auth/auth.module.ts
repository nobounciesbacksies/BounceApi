import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { HttpStrategy } from './http.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from 'nestjs-config';
import { AuthController } from './auth.controller';
import { FirestoreService } from '../services/firestore.service';

@Module({
  imports: [
    PassportModule.register({ 
        defualtStrategy: 'http',
        session: false
    }),
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        privateKey: config.get('auth.privateKey'),
        signOptions: {
          algorithm: config.get('auth.algo'),
          audience: config.get('auth.audience'),
          issuer: config.get('auth.issuer'),
          keyid: config.get('auth.kid'),
          expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, HttpStrategy, FirestoreService],
  exports: [PassportModule, AuthService],
})
export class AuthModule {}
