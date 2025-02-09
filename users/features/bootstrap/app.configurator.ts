import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConfiguratorInterface } from '@pe/cucumber-sdk';
import { RABBITMQ_SERVER, ValidationPipeObject } from '@pe/nest-kit';
import { useContainer } from 'class-validator';
import { AppModule } from '../../src/app.module';
import { Error } from 'mongoose';
import fastifyMultipart from 'fastify-multipart';

export class AppConfigurator implements AppConfiguratorInterface {
  public async setup(application: INestApplication): Promise<void> {

    useContainer(application.select(AppModule), { fallback: true, fallbackOnErrors: true });

    await application
      .getHttpAdapter()
      .getInstance()
      .register(fastifyMultipart);

    application.useGlobalPipes(
      new ValidationPipe(ValidationPipeObject({ transform: true, whitelist: false, forbidNonWhitelisted: false })),
    );
    application.connectMicroservice({
      strategy: application.get(RABBITMQ_SERVER),
    });
  }
}
