import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      maxParamLength: 1024,
      ignoreTrailingSlash: true,
    }),
    {
      logger: console,
    },
  );

  const swaggerOptions = new DocumentBuilder()
    .setTitle('No Bounce Api')
    .setDescription('Swagger documentation for REST based No Bounce API.')
    .setVersion('1.0.0')
    .addTag('Blacklist', 'The blacklist endpoints for handling a client\'s Blacklist')
    .addTag('Webhook', 'The webhook endpoints for handling webhook calls.')
    .addBearerAuth('Authorization', 'header')
    .setSchemes(AppModule.httpsOn)
    .setContactEmail('api-support@healthemail.com')
    .setBasePath('/v1')
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup('/v1/docs', app, swaggerDoc, {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  app.setGlobalPrefix('v1');

  await app.listen(AppModule.port, AppModule.host);
}
bootstrap();
