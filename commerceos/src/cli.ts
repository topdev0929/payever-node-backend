import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from '@pe/nest-kit/modules/command';
import { ApplicationModule } from './app.module';
import { INestApplicationContext } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(ApplicationModule);
  app
    .select(CommandModule)
    .get(CommandService)
    .exec();
}

// tslint:disable-next-line: no-floating-promises
bootstrap();
