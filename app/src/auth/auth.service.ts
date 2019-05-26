import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as argon2 from 'argon2';
import { accountDocument } from '../models/accountDocument';
import { FirestoreService } from 'src/services/firestore.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
    firestoreClient;

    constructor(
        private readonly jwtService: JwtService,
        firestoreService: FirestoreService
    ) {
        this.firestoreClient = firestoreService.getClient();
    }

    async login(username: string, password: string): Promise<any> {
        const hash = await argon2.hash(password);
        const accountInfo = await this.getAccountByUsername(username);
        if (accountInfo.password == hash) {
            return await this.createToken(accountInfo);
        } else {
            throw new HttpException('Incorrect username or password', HttpStatus.BAD_REQUEST)
        }
    }

    private async createToken(accountInfo: accountDocument): Promise<any> {
        const accountPayload: JwtPayload = { sub: accountInfo.accountDocId };
        // need ot figure out how to do this using the right secret and stuff
        const accessToken = await this.jwtService.signAsync(accountPayload);
        return {
            expiresIn: 3600,
            accessToken,
        };
    }

    async validateUser(payload: string): Promise<any> {
        this.jwtService.verifyAsync(payload, ) // need to learn how to do this
        // use this.jwtService.verifyAsync
        // user validation here, need to figure out how we do this??
        return {};
    }

    private async getAccountByUsername(username: string): Promise<accountDocument> {
        const accountDoc = this.firestoreClient.collection('accounts').where('username', '==', username).get();
        if (accountDoc.exists()) {
            return accountDoc;
        } else {
            throw new HttpException('Incorrect username or password', HttpStatus.BAD_REQUEST)
        }
    }

    private async getAccountById(accountDocId): Promise<any> {
        const accountDoc = this.firestoreClient.collection('accounts').doc(accountDocId).get();
        if (accountDoc.exists()) {
            return accountDoc;
        } else {
            throw new HttpException('Invalid Token', HttpStatus.BAD_REQUEST)
        }
    }
}