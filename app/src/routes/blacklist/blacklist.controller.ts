import { Controller, Get, Post, Delete, Body, UseGuards, Param } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { AuthGuard } from '@nestjs/passport';
import { Account } from '../../decorators/account.decorator';

@Controller('blacklist')
@UseGuards(AuthGuard('bearer'))
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Get()
  async returnBlacklistArray(@Account() accountId: string): Promise<any> {
    return this.blacklistService.returnBlacklistArray(accountId);
  }

  @Get(':blacklistId')
  async returnBlacklist(@Param('blacklistId') blacklistId: string, @Account() accountId: string): Promise<any> {
    return this.blacklistService.returnBlacklist(accountId, blacklistId);
  }

  @Post(':blacklistId/validateEmail')
  async sendEmailsBack(@Param('blacklistId') blacklistId: string, @Account() accountId, @Body('emails') emails: Array<string>): Promise<any> {
    return this.blacklistService.sendEmailsBack(accountId, blacklistId, emails);
  }

  @Delete(':blacklistId/remove')
  async removeEmails(@Param('blacklistId') blacklistId: string, @Account() accountId, @Body('emails') emails: Array<string>): Promise<any> {
    return this.blacklistService.removeEmails(accountId, blacklistId, emails);
  }

  @Post(':blacklistId/add')
  async addEmails(@Param('blacklistId') blacklistId: string, @Account() accountId, @Body('emails') emails: Array<string>): Promise<any> {
    return this.blacklistService.addEmails(accountId, blacklistId, emails);
  }
}
