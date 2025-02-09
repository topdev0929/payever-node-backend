import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from '@pe/nest-kit/modules/command';
import fastify from 'fastify';
import fastifyCookie from 'fastify-cookie';
import { ApplicationModule } from './app.module';

fastify().register(fastifyCookie);

async function bootstrap(): Promise<void> {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(ApplicationModule);
  app.select(CommandModule)
    .get(CommandService)
    .exec()
  ;
}
bootstrap().catch();
