import { Controller, Get, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { AuthGuard } from '@nestjs/passport';
import { Account } from '../../decorators/account.decorator';

//placeholders for the blacklist routes
@Controller('blacklist')
@UseGuards(AuthGuard('bearer'))
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Get()
  async returnBlacklist(@Account() account): Promise<string> {
    return this.blacklistService.returnBlacklist('blacklistID');
  }

  @Post()
  async sendEmailsBack(@Body('emails') emails: Array<string>): Promise<string> {
    return this.blacklistService.sendEmailsBack(emails, 'blacklistID');
  }

  @Delete()
  async removeEmails(@Body('emails') emails: Array<string>): Promise<string> {
    return this.blacklistService.removeEmails(emails, 'blacklistId');
  }

  @Post('/add')
  async addEmails(@Body('emails') emails: Array<string>): Promise<string> {
    return this.blacklistService.addEmails(emails, 'blacklistId');
  }
}
