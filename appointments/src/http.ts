import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { useContainer } from 'class-validator';
import { ValidationPipeObject } from '@pe/nest-kit';
import * as qs from 'qs';

import { AppModule } from './app.module';
import { environment } from './environments';

(async function bootstrap(): Promise<void> {
  const adapter: FastifyAdapter = new FastifyAdapter({
    querystringParser: (str: string): any => qs.parse(str),
  });

  const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  const logger: Logger = app.get(NestKitLogger);
  app.useLogger(logger);

  app.enableCors();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));

  app.setGlobalPrefix('/api');

  const options: DocumentBuilder = new DocumentBuilder()
    .setTitle('Appointment')
    .setDescription('The Appointment micro')
    .setVersion('1.0')
    .setBasePath('/api/')
    .addTag('appointment')
    .addBearerAuth();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, options.build());
  SwaggerModule.setup('api-docs', app, document);

  app.enableShutdownHooks();

  await app.listen(
    environment.port,
    '0.0.0.0',
    () => logger.log(`Appointment app started at port [${environment.port}]`, 'NestApplication'),
  );
})().catch((e: any) => {
  /* eslint no-console: 0 */
  process.exit(1);
});
