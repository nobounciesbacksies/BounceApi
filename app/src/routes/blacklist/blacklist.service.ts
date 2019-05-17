import { Injectable } from '@nestjs/common';
import { FirestoreService } from 'src/services/firestore.service';
import { EmailDocument } from '../../models/EmailDocument';

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

    return allEmails.map(currentElement => {
      return currentElement.email;
    });
  }

  async sendEmailsBack(emails: Array<string>, blacklistID: string): Promise<any> {
    const emailCollectionRef = await this.firestoreClient
      .collection('blacklist')
      .doc(blacklistID)
      .collection('emails');
    const allEmails: Array<EmailDocument> = await emailCollectionRef.get();
    const whitelist: Array<string> = [];
    const blacklist: Array<string> = [];

    emails.forEach(element => {
      if (allEmails.some(val => {
        return element === val.email;
      })) {
        blacklist.push(element);
      } else {
        whitelist.push(element);
      }
    });

    return {
      blacklist,
      whitelist
    };
  }

  async removeEmails(emails: Array<string>, blacklistID: string): Promise<any> {
    const deletedEmails: Array<string> = [];
    const didNotExist: Array<string> = [];

    emails.forEach(async element => {
      //check if it exists
      if (true) {
        // get the email docx ID
        await this.firestoreClient.collection('blacklist').doc(blacklistID).collection('emails').doc('email').delete();
        deletedEmails.push(element)
      } else {
        didNotExist.push(element)
      }
    });
    return {
      deletedEmails,
      didNotExist
    };
  }

  async addEmails(): Promise<string> {
    const emailCollectionRef = this.firestoreClient.collection('blacklist').doc('blacklistID').collection('emails');
    // for loop to add each one, it will overwrite if it already exists, check for already exists first?
    // using .set() to add it. Also the firestore timestamp thing might be good, not sure what else is available
    // check if it already exists before using set
    return 'add emails here';
  }
}

