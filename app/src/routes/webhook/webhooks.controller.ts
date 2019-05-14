import { Controller, Post } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

//placeholder for aws webhooks
@Controller()
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('/aws/:webhookId')
  async recieveHook(webhookId: string): Promise<string> {
    return this.webhooksService.recieveHook(webhookId);
  }
}
