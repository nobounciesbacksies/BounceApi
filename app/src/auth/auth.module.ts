import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from 'nestjs-config';

@Module({
    imports: [
        PassportModule.register({ defualtStrategy: 'jwt' }),
        JwtModule.registerAsync({
            useFactory: async (config: ConfigService) => ({
                privateKey: config.get('auth.privateKey'),
                signOptions: {
                    algorithm: 'RS256',
                    audience: 'blacklist-api',
                    issuer: 'healthEmail.io',
                    keyid: config.get('auth.kid'),
                    expiresIn: 3600,
                },
                verifyOptions: {
                       
                }
            }),
        }),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [PassportModule, AuthService],
})
export class AuthModule {}