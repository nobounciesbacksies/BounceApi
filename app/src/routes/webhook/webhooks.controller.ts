import { Controller, Post, Body } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';



@Controller()
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('/aws/:webhookId')
  async recieveHook(@Body() jsonInfo: any, webhookId: string): Promise<any> {
    this.webhooksService.recieveHook(jsonInfo, webhookId);
    return;
  }
}
