import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from '@pe/nest-kit/modules/command';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(AppModule);
  app.select(CommandModule)
    .get(CommandService)
    .exec()
  ;
}
// tslint:disable-next-line: no-floating-promises
bootstrap().then();
