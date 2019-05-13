import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhooksService {
  async recieveHook(webhookId: string): Promise<string> {
    return 'recieve aws webhooks here';
  }
}
