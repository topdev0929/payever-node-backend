import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule } from '@pe/business-kit';

import { ApplicationSchema, ApplicationSchemaName } from './schemas';
import { BuilderApplicationService } from './services';
import { CollectorModule, MutexModule } from '@pe/nest-kit';
import { ApplicationMessagesConsumer } from './consumers';
import { CreateDefaultThemeCommand } from './commands';
import { BusinessEventsListener } from './event-listeners';

@Module({
  controllers: [
    ApplicationMessagesConsumer,
  ],
  exports: [],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: ApplicationSchemaName, schema: ApplicationSchema },
    ]),
    BusinessModule,
    MutexModule,
    CollectorModule,
  ],
  providers: [
    BuilderApplicationService,
    CreateDefaultThemeCommand,
    BusinessEventsListener,
  ],
})

export class BuilderApplicationModule { }
