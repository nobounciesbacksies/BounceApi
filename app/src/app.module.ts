import { ConfigModule, ConfigService } from 'nestjs-config';
import { Module } from '@nestjs/common';
import * as path from 'path';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [
    RoutesModule,
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
  ],
})
export class AppModule {
  /** The host to run the application on */
  static host: string;

  /** Tell whether to serve with https or not for swagger */
  static httpsOn: 'http' | 'https';

  /** App port to run application */
  static port: number;

  constructor(private readonly config: ConfigService) {
    AppModule.port = config.get('app.port');
    AppModule.httpsOn = config.get('app.httpsOn');
    AppModule.host = config.get('app.host');
  }
}
