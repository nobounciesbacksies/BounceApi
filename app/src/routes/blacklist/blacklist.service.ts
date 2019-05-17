import { Injectable } from '@nestjs/common';
import { FirestoreService } from 'src/services/firestore.service';
import { EmailDocument, EmailAddedFrom } from '../../models/EmailDocument';

@Injectable()
export class BlacklistService {
  firestoreClient;

  constructor(firestoreService: FirestoreService) {
    this.firestoreClient = firestoreService.getClient();
  }

  async returnBlacklist(blacklistID: string): Promise<any> {
    const emailCollectionRef = await this.firestoreClient
      .collection('blacklist')
      .doc(blacklistID)
      .collection('emails');
    const allEmails: Array<EmailDocument> = await emailCollectionRef.get();

    return allEmails.map(currentEmailDoc => {
      return currentEmailDoc.email;
    });
  }

  async sendEmailsBack(emailsArray: Array<string>, blacklistID: string): Promise<any> {
    const emailCollectionRef = await this.firestoreClient
      .collection('blacklist')
      .doc(blacklistID)
      .collection('emails');
    const allEmails: Array<EmailDocument> = await emailCollectionRef.get();
    const whitelist: Array<string> = [];
    const blacklist: Array<string> = [];

    emailsArray.forEach(email => {
      if (allEmails.some(emailDoc => {
        return email === emailDoc.email;
      })) {
        blacklist.push(email);
      } else {
        whitelist.push(email);
      }
    });

    return {
      blacklist,
      whitelist
    };
  }

  async removeEmails(emailsArray: Array<string>, blacklistID: string): Promise<any> {
    const deletedEmails: Array<string> = [];
    const didNotExist: Array<string> = [];
    const emailCollectionRef = this.firestoreClient
      .collection('blacklist')
      .doc(blacklistID)
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
      didNotExist
    };
  }

  async addEmails(emailsArray: Array<string>, blacklistID: string): Promise<any> {
    const emailCollectionRef = this.firestoreClient
      .collection('blacklist')
      .doc(blacklistID)
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
          unsubscribed: false
        }
        await emailCollectionRef.doc(email).set(newEmail);
        addedEmails.push(email);
      }
    });
    return {
      addedEmails,
      existedEmails
    };
  }
}

