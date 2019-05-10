import { Module } from '@nestjs/common';
import { BlacklistModule } from './blacklist/blacklist.module';
import { WebhooksModule } from './webhook/webhooks.module'

@Module({
    imports: [BlacklistModule, WebhooksModule]
})
export class RoutesModule {}