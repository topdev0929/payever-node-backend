import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from '@pe/nest-kit';
import { AppModule } from './app.module';

async function bootstrap(): Promise<any> {
  const app: any = await NestFactory.createApplicationContext(AppModule);
  const service: CommandService = app.select(CommandModule)
    .get(CommandService);

  service.exec();
}
// tslint:disable-next-line: no-floating-promises
bootstrap().then();
