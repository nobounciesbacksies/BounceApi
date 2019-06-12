import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { FirestoreService } from 'src/services/firestore.service';
import { ConfigService } from 'nestjs-config';
import { QuerySnapshot, DocumentSnapshot } from '@google-cloud/firestore';

@Injectable()
export class AuthService {
  firestoreClient: FirebaseFirestore.Firestore;

  constructor(
    private readonly jwtService: JwtService,
    firestoreService: FirestoreService,
    private readonly config: ConfigService,
  ) {
    this.firestoreClient = firestoreService.getClient();
  }

  async login(username: string, password: string): Promise<any> {
    const passwordHash = await argon2.hash(password);
    const accountInfo = await this.getAccountByUsername(username, passwordHash);
    return await this.createToken(accountInfo);
  }

  private async createToken(accountInfo: DocumentSnapshot): Promise<any> {
    const accountPayload = { sub: accountInfo.id };
    const accessToken = await this.jwtService.signAsync(accountPayload);
    return {
      expiresIn: 3600,
      accessToken,
    };
  }

  async validateUser(payload: string): Promise<DocumentSnapshot> {
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
    passwordHash: string,
  ): Promise<DocumentSnapshot> {
    const accountQuery: QuerySnapshot = await this.firestoreClient
      .collection('accounts')
      .where('username', '==', username)
      .where('password', '==', passwordHash)
      .get();
    if (accountQuery.empty) {
      throw new UnauthorizedException('Incorrect username or password.');
    }
    return accountQuery.docs[0]
  }

  private async getAccountById(accountDocId: string): Promise<DocumentSnapshot> {
    const accountDoc: DocumentSnapshot = await this.firestoreClient
      .collection('accounts')
      .doc(accountDocId)
      .get();
    if (accountDoc.exists) {
      return accountDoc;
    }
    throw new UnauthorizedException('Invalid token.');
  }

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
