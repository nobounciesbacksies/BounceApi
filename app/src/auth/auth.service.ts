import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { accountDocument } from '../models/accountDocument';
import { FirestoreService } from 'src/services/firestore.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';

@Injectable()
export class AuthService {
  firestoreClient;

  constructor(
    private readonly jwtService: JwtService,
    firestoreService: FirestoreService,
    private readonly config: ConfigService,
  ) {
    this.firestoreClient = firestoreService.getClient();
  }

  async login(username: string, password: string): Promise<any> {
    const hash = await argon2.hash(password);
    const accountInfo = await this.getAccountByUsername(username);
    if (accountInfo.password == hash) {
      return await this.createToken(accountInfo);
    }
    throw new HttpException(
      'Incorrect username or password',
      HttpStatus.BAD_REQUEST,
    );
  }

  private async createToken(accountInfo: accountDocument): Promise<any> {
    const accountPayload = { sub: accountInfo.accountDocId };
    const accessToken = await this.jwtService.signAsync(accountPayload);
    return {
      expiresIn: 3600,
      accessToken,
    };
  }

  async validateUser(payload: string): Promise<any> {
    if (this.config.get('app.isDevelopment')) {
      const account: accountDocument = {
        accountDocId: 'testdocid',
        createdAt: new Date(),
        createdBy: 'trevor',
        deletedAt: null,
        email: 'testing@testing.test',
        password: 'aslkdfjaaweuhiauobd89723yr89t378fga9wevf8v2i3uyfgiouygwe8f',
        updatedAt: null,
        updatedBy: null,
        username: 'testaccount'
      }
      return account
    }
    const decoded: any = jwt.decode(payload, { complete: true });

    this.verifyDecoded(decoded);
    const account = this.getAccountById(decoded.payload.sub);

    jwt.verify(
      payload,
      this.config.get('auth.publicKey'),
      {
        algorithms: [this.config.get('auth.algo')],
        audience: this.config.get('auth.audience'),
        clockTolerance: this.config.get('auth.clockTolerance'),
        issuer: this.config.get('auth.issuer'),
      },
      err => {
        if (err) {
          throw new UnauthorizedException(err.message);
        }

        return account;
      },
    );

    return account;
  }

  private async getAccountByUsername(
    username: string,
  ): Promise<accountDocument> {
    const accountDoc = this.firestoreClient
      .collection('accounts')
      .where('username', '==', username)
      .get();
    if (accountDoc.exists()) {
      return accountDoc;
    }
    throw new UnauthorizedException('Incorrect username or password.');
  }

  private async getAccountById(accountDocId): Promise<any> {
    const accountDoc = this.firestoreClient
      .collection('accounts')
      .doc(accountDocId)
      .get();
    if (accountDoc.exists()) {
      return accountDoc;
    }
    throw new UnauthorizedException('Invalid token.');
  }

  /**
   * This checks the values of the token to make sure it is valid.
   * @param decoded the decoded object jws of the token.
   */
  private async verifyDecoded(decoded: any): Promise<void> {
    const kid = decoded.header.kid || null;

    if (!kid || kid !== this.config.get('auth.kid')) {
      throw new UnauthorizedException('No "Kid" specified in headers.');
    }

    const account = decoded.payload.sub || null;

    if (!account) {
      throw new UnauthorizedException(
        'No user specified in "Sub" payload field.',
      );
    }
  }
}
