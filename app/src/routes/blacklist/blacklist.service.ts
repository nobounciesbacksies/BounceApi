import { Injectable, NotFoundException } from '@nestjs/common';
import { FirestoreService } from '../../services/firestore.service';
import { EmailDocument, EmailAddedFrom } from '../../models/EmailDocument';
import { ConfigService } from 'nestjs-config';
import * as jwt from 'jsonwebtoken';
import { whitelistEmail } from 'src/models/whitelistReturn';
import { DocumentSnapshot, QuerySnapshot, DocumentData } from '@google-cloud/firestore';

@Injectable()
export class BlacklistService {
  firestoreClient: FirebaseFirestore.Firestore;
  private readonly config: ConfigService;

  constructor(firestoreService: FirestoreService) {
    this.firestoreClient = firestoreService.getClient();
  }

  async returnBlacklistArray(accountId: string): Promise<any> {
    const accountDoc: DocumentSnapshot = await this.firestoreClient.collection('account').doc(accountId).get();
    // blacklists object needs interface I think
    return accountDoc.get('blacklists');
  }
  
  async validateBlacklistExists(accountId: string, blacklistId: string): Promise<any> {
    const accountDoc: DocumentSnapshot = await this.firestoreClient.collection('account').doc(accountId).get();
    if (!(blacklistId in accountDoc.get('blacklists'))) {
      return new NotFoundException('Invalid blacklistId');
    }
  }

  async createUnsubscriptionLink(email: string): Promise<string> {
    const apiUrl = 'www.healthemail.io/api/v1/unsub/';
    const unsubToken: string = jwt.sign(email, this.config.get('subscription.privateKey'), this.config.get('subscription.signOptions'));
    return apiUrl.concat(unsubToken);
  }

  async returnBlacklist(accountId: string, blacklistId: string): Promise<any> {
    await this.validateBlacklistExists(accountId, blacklistId);
    const emailCollectionRef = await this.firestoreClient
      .collection('blacklist')
      .doc(blacklistId)
      .collection('emails');
    const emailsQuery: QuerySnapshot = await emailCollectionRef.get();

    return emailsQuery.docs.map(emailDoc => {
      return {
        email: emailDoc.id,
        addedFrom: emailDoc.get('addedFrom'),
      }
    });
  }

  async sendEmailsBack(
    accountId: string,
    blacklistId: string,
    emailsArray: Array<string>,
  ): Promise<any> {
    await this.validateBlacklistExists(accountId, blacklistId);
    const emailCollectionRef = await this.firestoreClient
      .collection('blacklist')
      .doc(blacklistId)
      .collection('emails');
    const allEmails: QuerySnapshot = await emailCollectionRef.get();
    const whitelist: Array<whitelistEmail> = [];
    const blacklist: Array<string> = [];

    emailsArray.forEach(async email => {
      if (
        allEmails.docs.some(emailDoc => {
          return email === emailDoc.id;
        })
      ) {
        blacklist.push(email);
      } else {
        const unsubUrl = await this.createUnsubscriptionLink(email);

        whitelist.push({
          email: email,
          unsubscribe: unsubUrl,
        });
      }
    });

    return {
      blacklist,
      whitelist,
    };
  }

  async removeEmails(
    accountId: string,
    blacklistId: string,
    emailsArray: Array<string>,
  ): Promise<any> {
    await this.validateBlacklistExists(accountId, blacklistId);
    const deletedEmails: Array<string> = [];
    const didNotExist: Array<string> = [];
    const emailCollectionRef = this.firestoreClient
      .collection('blacklist')
      .doc(blacklistId)
      .collection('emails');

    emailsArray.forEach(async email => {
      const emailDoc: DocumentSnapshot = await emailCollectionRef.doc(email).get();
      if (emailDoc.exists) {
        await emailCollectionRef.doc(email).delete();
        deletedEmails.push(email);
      } else {
        didNotExist.push(email);
      }
    });
    return {
      deletedEmails,
      didNotExist,
    };
  }

  async addEmails(
    accountId: string,
    blacklistId: string,
    emailsArray: Array<string>,
  ): Promise<any> {
    await this.validateBlacklistExists(accountId, blacklistId);
    const emailCollectionRef = this.firestoreClient
      .collection('blacklist')
      .doc(blacklistId)
      .collection('emails');
    const addedEmails: Array<string> = [];
    const existedEmails: Array<string> = [];

    emailsArray.forEach(async email => {
      const emailDoc: DocumentSnapshot = await emailCollectionRef.doc(email).get();
      if (emailDoc.exists) {
        existedEmails.push(email);
      } else {
        const newEmail: EmailDocument = {
          addedFrom: EmailAddedFrom.userApi,
          createdAt: new Date(),
          createdBy: 'userID',
          unsubscribed: false,
        };
        await emailCollectionRef.doc(email).set(newEmail);
        addedEmails.push(email);
      }
    });
    return {
      addedEmails,
      existedEmails,
    };
  }
}