import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';

//placeholders for the blacklist routes
@Controller('blacklist')
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Get()
  async returnBlacklist(): Promise<string> {
    return this.blacklistService.returnBlacklist('blacklistID');
  }

  @Post()
  async sendEmailsBack(@Body('emails') emails: Array<string>): Promise<string> {
    return this.blacklistService.sendEmailsBack(emails, 'blacklistID');
  }

  @Delete()
  async removeEmails(): Promise<string> {
    return this.blacklistService.removeEmails();
  }

  @Post('/add')
  async addEmails(): Promise<string> {
    return this.blacklistService.addEmails();
  }
}
