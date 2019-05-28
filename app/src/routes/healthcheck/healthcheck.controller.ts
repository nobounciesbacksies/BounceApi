import { Get, Controller, Head, HttpCode, UseGuards } from '@nestjs/common/decorators';
import { HealthcheckService } from './healthcheck.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * The controller that handles healthcheck functionality.
 */
@Controller()
export class HealthcheckController {
  /**
   * The constructor with injections.
   * @param healthcheckService
   */
  constructor(private readonly healthcheckService: HealthcheckService) {}

  /**
   * Root healthcheck call
   */
  @Get('/healthcheck')
  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.OK)
  root(): object {
    return this.healthcheckService.getStatus();
  }

  /**
   * Root healthcheck call
   */
  @Get('/ping')
  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.OK)
  ping(): string {
    return 'pong';
  }

  /**
   * This is the head call that is called frequently by synthetic checks.
   */
  @Head('/healthcheck')
  @ApiExcludeEndpoint()
  @HttpCode(HttpStatus.OK)
  head(): any {}
}
