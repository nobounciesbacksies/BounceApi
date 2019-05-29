import { Controller, Get, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { AuthGuard } from '@nestjs/passport';
import { Account } from '../../decorators/account.decorator';

//placeholders for the blacklist routes
@Controller('blacklist')
@UseGuards(AuthGuard('bearer'))
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Get('list')
  async returnBlacklistArray(@Account() accountId: string): Promise<any> {
    return this.blacklistService.returnBlacklistArray(accountId);
  }

  @Get()
  async returnBlacklist(@Account() accountId: string, @Body('blacklistId') blacklistId: string): Promise<any> {
    return this.blacklistService.returnBlacklist(accountId, blacklistId);
  }

  @Post()
  async sendEmailsBack(@Account() accountId, @Body('blacklistId') blacklistId, @Body('emails') emails: Array<string>): Promise<any> {
    return this.blacklistService.sendEmailsBack(accountId, blacklistId, emails);
  }

  @Delete()
  async removeEmails(@Account() accountId, @Body('blacklistId') blacklistId, @Body('emails') emails: Array<string>): Promise<any> {
    return this.blacklistService.removeEmails(accountId, blacklistId, emails);
  }

  @Post('/add')
  async addEmails(@Account() accountId, @Body('blacklistId') blacklistId, @Body('emails') emails: Array<string>): Promise<any> {
    return this.blacklistService.addEmails(accountId, blacklistId, emails);
  }
}
