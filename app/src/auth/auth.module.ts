import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import * as sha1 from 'sha1';

@Module({
    imports: [
        PassportModule.register({ defualtStrategy: 'jwt' }),
        JwtModule.register({
            privateKey: 'privatekey',//in an env variable
            signOptions: {
                algorithm: 'RS256',
                audience: 'blacklist-api',
                issuer: 'healthEmail.io',
                keyid: sha1('privateKey'), // env variable
                expiresIn: 3600,
            },
            verifyOptions: {
                
            }
        }),
    ],
    providers: [AuthService, JwtStrategy],
    exports: [PassportModule, AuthService],
})
export class AuthModule {}