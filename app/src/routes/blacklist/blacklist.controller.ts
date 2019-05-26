import { Controller, Get, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { AuthGuard } from '@nestjs/passport';

//placeholders for the blacklist routes
@Controller('blacklist')
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @Get()
  @UseGuards(AuthGuard())
  async returnBlacklist(): Promise<string> {
    return this.blacklistService.returnBlacklist('blacklistID');
  }

  @Post()
  @UseGuards(AuthGuard())
  async sendEmailsBack(@Body('emails') emails: Array<string>): Promise<string> {
    return this.blacklistService.sendEmailsBack(emails, 'blacklistID');
  }

  @Delete()
  @UseGuards(AuthGuard())
  async removeEmails(@Body('emails') emails: Array<string>): Promise<string> {
    return this.blacklistService.removeEmails(emails, 'blacklistId');
  }

  @Post('/add')
  @UseGuards(AuthGuard())
  async addEmails(@Body('emails') emails: Array<string>): Promise<string> {
    return this.blacklistService.addEmails(emails, 'blacklistId');
  }
}
