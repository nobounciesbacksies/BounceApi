import { Strategy } from 'passport-http-bearer';
import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(payload: string): Promise<any> {
    return { 
      account: await this.authService.validateUser(payload)
    };
  }
}
