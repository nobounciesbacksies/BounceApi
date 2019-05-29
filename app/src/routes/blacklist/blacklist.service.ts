import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirestoreService } from '../../services/firestore.service';
import { EmailDocument, EmailAddedFrom } from '../../models/EmailDocument';
import { accountDocument } from 'src/models/accountDocument';

@Injectable()
export class BlacklistService {
  firestoreClient;

  constructor(firestoreService: FirestoreService) {
    this.firestoreClient = firestoreService.getClient();
  }

  async returnBlacklistArray(accountId: string): Promise<any> {
    const accountDoc: accountDocument = await this.firestoreClient.collection('account').doc(accountId).get();
    return accountDoc.blacklists;
  }

  async returnBlacklist(accountId: string, blacklistId: string): Promise<any> {
    const accountDoc: accountDocument = await this.firestoreClient.collection('account').doc(accountId).get();
    if (accountDoc.blacklists.includes(blacklistId)) {
      return new UnauthorizedException('Invalid blacklistId');
    }
    const emailCollectionRef = await this.firestoreClient
      .collection('blacklist')
      .doc(blacklistId)
      .collection('emails');
    const allEmails: Array<EmailDocument> = await emailCollectionRef.get();

    return allEmails.map(currentEmailDoc => {
      return currentEmailDoc.email;
    });
  }

  async sendEmailsBack(
    accountId: string,
    blacklistId: string,
    emailsArray: Array<string>,
  ): Promise<any> {
    const accountDoc: accountDocument = this.firestoreClient.collection('account').doc(accountId).get()
    if (!accountDoc.blacklists.includes(blacklistId)) {
      return new UnauthorizedException('Invalid blacklistId');
    }
    const emailCollectionRef = await this.firestoreClient
      .collection('blacklist')
      .doc(blacklistId)
      .collection('emails');
    const allEmails: Array<EmailDocument> = await emailCollectionRef.get();
    const whitelist: Array<string> = [];
    const blacklist: Array<string> = [];

    emailsArray.forEach(email => {
      if (
        allEmails.some(emailDoc => {
          return email === emailDoc.email;
        })
      ) {
        blacklist.push(email);
      } else {
        whitelist.push(email);
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
    const accountDoc: accountDocument = this.firestoreClient.collection('account').doc(accountId).get()
    if (!accountDoc.blacklists.includes(blacklistId)) {
      return new UnauthorizedException('Invalid blacklistId');
    }
    const deletedEmails: Array<string> = [];
    const didNotExist: Array<string> = [];
    const emailCollectionRef = this.firestoreClient
      .collection('blacklist')
      .doc(blacklistId)
      .collection('emails');

    emailsArray.forEach(async email => {
      const emailDoc = emailCollectionRef.doc(email).get();
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
    const accountDoc: accountDocument = this.firestoreClient.collection('account').doc(accountId).get()
    if (!accountDoc.blacklists.includes(blacklistId)) {
      return new UnauthorizedException('Invalid blacklistId');
    }
    const emailCollectionRef = this.firestoreClient
      .collection('blacklist')
      .doc(blacklistId)
      .collection('emails');
    const addedEmails: Array<string> = [];
    const existedEmails: Array<string> = [];

    emailsArray.forEach(async email => {
      const emailDoc = emailCollectionRef.doc(email).get();
      if (emailDoc.exists) {
        existedEmails.push(email);
      } else {
        const newEmail: EmailDocument = {
          email: email,
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
