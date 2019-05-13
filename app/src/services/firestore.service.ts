import { Injectable } from '@nestjs/common';
import * as FirestoreClient from '@google-cloud/firestore';

@Injectable()
export class FirestoreService {
    firestoreClient;

    constructor() {
        this.firestoreClient = FirestoreClient;
    }

    public getClient() {
        return this.firestoreClient;
    }
}
