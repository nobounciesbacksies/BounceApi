import { Controller, Get, Post, Delete, Body, UseGuards, Param, HttpCode } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { AuthGuard } from '@nestjs/passport';
import { Account } from '../../decorators/account.decorator';

@Controller('blacklist')
@UseGuards(AuthGuard('bearer'))
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @HttpCode(200)
  @Get()
  async returnBlacklistArray(@Account() accountId: string): Promise<any> {
    return this.blacklistService.returnBlacklistArray(accountId);
  }

  @HttpCode(200)
  @Get(':blacklistId')
  async returnBlacklist(@Param('blacklistId') blacklistId: string, @Account() accountId: string): Promise<any> {
    return this.blacklistService.returnBlacklist(accountId, blacklistId);
  }

  @HttpCode(200)
  @Post(':blacklistId/validateEmail')
  async sendEmailsBack(@Param('blacklistId') blacklistId: string, @Account() accountId, @Body('emails') emails: Array<string>): Promise<any> {
    return this.blacklistService.sendEmailsBack(accountId, blacklistId, emails);
  }

  @HttpCode(200)
  @Delete(':blacklistId/remove')
  async removeEmails(@Param('blacklistId') blacklistId: string, @Account() accountId, @Body('emails') emails: Array<string>): Promise<any> {
    return this.blacklistService.removeEmails(accountId, blacklistId, emails);
  }

  @HttpCode(200)
  @Post(':blacklistId/add')
  async addEmails(@Param('blacklistId') blacklistId: string, @Account() accountId, @Body('emails') emails: Array<string>): Promise<any> {
    return this.blacklistService.addEmails(accountId, blacklistId, emails);
  }
}
