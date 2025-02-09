import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipeObject, RABBITMQ_SERVER } from '@pe/nest-kit';
import { useContainer } from 'class-validator';
import fastifyMultipart from 'fastify-multipart';

import { ApplicationModule } from '../../src/app.module';

export class AppConfigurator {
  public async setup(application: INestApplication): Promise<void> {
    application.connectMicroservice<MicroserviceOptions>({
      strategy: application.get(RABBITMQ_SERVER),
    });

    (application as NestFastifyApplication).useGlobalPipes(new ValidationPipe(ValidationPipeObject({ })));
    useContainer(application.select(ApplicationModule), { fallbackOnErrors: true});

    await application
      .getHttpAdapter()
      .getInstance()
      .addHook('onRequest', (request: any, reply: any, done: any) => {
        reply.setHeader = function(key: string, value: string): any {
          return this.raw.setHeader(key, value);
        };
        reply.end = function(): void {
          this.raw.end();
        };
        request.res = reply;
        done();
      })
      .register(fastifyMultipart, {
        attachFieldsToBody: true,
      });
  }
}
