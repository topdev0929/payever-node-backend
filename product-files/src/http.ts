import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestKitLogger } from '@pe/nest-kit/modules/logging/services';
import { AppModule } from './app.module';
import { environment } from './environments';
import { FastifyAdapter } from '@nestjs/platform-fastify';

// eslint-disable-next-line
const pkg: any = require(process.env.PWD + '/package.json');

async function bootstrap(): Promise<any> {
  const adapter: FastifyAdapter = new FastifyAdapter({
    logger: false,
  });

  const app: any = await NestFactory.create(
    AppModule,
    adapter,
  );
  const logger: any = app.get(NestKitLogger);
  app.useLogger(logger);

  if (environment.appCors) {
    app.enableCors({ maxAge: 600 });
  }

  app.setGlobalPrefix('/api');

  const options: any = new DocumentBuilder()
    .setTitle(pkg.name)
    .setDescription(pkg.description)
    .setVersion(pkg.version)
    .setBasePath('/api')
    .addTag('product-files')
    .build();

  const document: any = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  app.enableShutdownHooks();
  await app.listen(
    environment.port,
    '0.0.0.0',
    () => logger.log(`Product-files app started at port [${environment.port}]`, 'NestApplication'),
  );
}
// tslint:disable-next-line: no-floating-promises
bootstrap().then();
