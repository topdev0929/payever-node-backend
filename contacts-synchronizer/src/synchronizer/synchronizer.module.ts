import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntegrationModule } from '@pe/synchronizer-kit';

import { MongooseSchemas } from './config';
import { InnerEventProducer, OuterEventProducer } from './producers';
import { MailerEventProducer } from './producers/mailer.event.producer';
import {
  SynchronizationTaskItemService,
  SynchronizationTaskService,
  SynchronizationService,
  FileImportService,
} from './services';

import { HelperService } from './services/helper.service';

@Module({
  exports: [
    SynchronizationService,
    SynchronizationTaskService,
    SynchronizationTaskItemService,
    FileImportService,
    OuterEventProducer,
    InnerEventProducer,
    HelperService,
    MailerEventProducer,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(MongooseSchemas),
    IntegrationModule,
  ],
  providers: [
    FileImportService,
    SynchronizationTaskService,
    InnerEventProducer,
    OuterEventProducer,
    MailerEventProducer,
    SynchronizationTaskItemService,
    SynchronizationService,
    HelperService,
  ],
})
export class SynchronizerModule { }
