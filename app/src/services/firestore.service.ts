import { Injectable } from '@nestjs/common';
import { Firestore } from '@google-cloud/firestore';

@Injectable()
export class FirestoreService {
    firestoreClient: Firestore;

    constructor() {
        this.firestoreClient = new Firestore();
        const emailCollectionRef = this.firestoreClient.collection('blacklist').doc('blah').collection('emails');

        
        emailCollectionRef.whe
    }

    public getClient() {
        return this.firestoreClient;
    }
}
