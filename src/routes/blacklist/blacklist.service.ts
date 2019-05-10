import { Injectable } from '@nestjs/common';


@Injectable()
export class BlacklistService {
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