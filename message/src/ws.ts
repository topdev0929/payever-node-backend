import * as path from 'path';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';

import { WsAppModule } from './wsapp.module';
import { environment } from './environments';
import { RedisIoAdapter } from './ws/custom-ws.adapter';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

(async function bootstrap(): Promise<void> {
  const adapter: FastifyAdapter = new FastifyAdapter();
  if (!environment.production) {
    adapter.useStaticAssets({
      root: path.join(__dirname, 'static'),
    });
  }
  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    WsAppModule,
    adapter,
  );

  const logger: Logger = app.get(NestKitLogger);

  app.useWebSocketAdapter(
    new RedisIoAdapter(app),
  );

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Message')
    .setDescription('The Message micro')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('message')
    .addBearerAuth();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(
    environment.wsPort,
    '0.0.0.0',
    () => logger.log(`Message socket.io instance started at port [${environment.wsPort}]`, 'NestApplication'),
  );
})().catch((e: any) => {
  Logger.error(e);
  process.exit(1);
});
