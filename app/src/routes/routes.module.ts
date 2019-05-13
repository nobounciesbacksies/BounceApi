import { Module, MiddlewareConsumer } from '@nestjs/common';
import { BlacklistModule } from './blacklist/blacklist.module';
import { WebhooksModule } from './webhook/webhooks.module'
import { CompressionMiddleware } from '@nest-middlewares/compression';
// import { CorsMiddleware } from '@nest-middlewares/cors';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { ResponseTimeMiddleware } from '@nest-middlewares/response-time';
import { BlacklistController } from './blacklist/blacklist.controller';
import { WebhooksController } from './webhook/webhooks.controller';
import { HealthcheckModule } from './healthcheck/healthcheck.module';

@Module({
    imports: [BlacklistModule, WebhooksModule, HealthcheckModule]
})
export class RoutesModule {

    /**
   * The function controls what middleware gets applied to routes globally.
   * @param consumer The middleware consumer used to control what middleware gets applied.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        CompressionMiddleware,
        // CorsMiddleware,
        HelmetMiddleware,
        ResponseTimeMiddleware,
      )
      .forRoutes(BlacklistController, WebhooksController);
  }
}