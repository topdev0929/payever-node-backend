import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from '@pe/nest-kit/modules/command';
import { ApplicationModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(ApplicationModule);
  app.select(CommandModule)
    .get(CommandService)
    .exec()
  ;
}
bootstrap().catch();
