import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { HealthcheckController } from './healthcheck.controller';
import { HealthcheckService } from './healthcheck.service';

/**
 * Definition of the module for healthcheck so we can inject it into routes.
 */
@Module({
  controllers: [HealthcheckController],
  providers: [HealthcheckService],
})
export class HealthcheckModule {}