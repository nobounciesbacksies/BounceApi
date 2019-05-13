import { Injectable } from '@nestjs/common';

/**
 * The service for the healthcheck to provide the data to the controller.
 */
@Injectable()
export class HealthcheckService {
  /**
   * Returns status
   */
  getStatus(): object {
    return {
      timestamp: new Date().toISOString(),
    };
  }
}