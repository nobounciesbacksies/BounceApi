import { Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';

@Injectable()
export class FirestoreService {
    firestoreClient: Firestore;

    constructor() {
        this.firestoreClient = new Firestore();
    }

    public getClient() {
        return this.firestoreClient;
    }
}
