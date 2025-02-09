import { INestApplicationContext, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { CommandModule, CommandService } from '@pe/nest-kit';
import { HttpAppModule } from './httpapp.module';

(async function bootstrap(): Promise<void> {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(HttpAppModule);
  const service: CommandService = app.select(CommandModule)
    .get(CommandService);

  service.exec();
})().catch((e: any) => {
  Logger.error(e);
  process.exit(1);
});
