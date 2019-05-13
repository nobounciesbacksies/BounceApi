import { Injectable } from '@nestjs/common';
import { FirestoreService } from 'src/services/firestore.service';

@Injectable()
export class BlacklistService {
  constructor(firestoreService: FirestoreService) {}

  async returnBlacklist(): Promise<string> {
    return 'return entire blacklist here';
  }

  async sendEmailsBack(): Promise<string> {
    return 'send back good and bad emails';
  }

  async removeEmails(): Promise<string> {
    return 'remove emails from blacklist here';
  }

  async addEmails(): Promise<string> {
    return 'add emails here';
  }
}
