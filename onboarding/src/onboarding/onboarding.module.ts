import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IntercomModule } from '@pe/nest-kit';
import { ProcessBulkImportConsumer, TaskCreatedConsumer, TaskProcessedConsumer } from './consumers';
import { SetupController, TemplateController, ReportController } from './controllers';
import {
  AppsProcessor,
  BusinessProcessor,
  CheckoutProcessor,
  ConnectProcessor,
  ConnectSettingsProcessor,
  PosProcessor,
  PreloadMediaProcessor,
  WallpaperProcessor,
} from './processors';
import {
  BulkImport,
  BulkImportSchema,
  Report,
  ReportSchema,
  ReportDetailSchema,
  Task,
  TaskSchema,
  TemplateSchema,
  TemplateSchemaName,
} from './schemas';
import {
  BulkImportService,
  SetupService,
  TaskExecutor,
  TaskService,
  TemplateService,
  ReportService,
  ReportExecutor,
  ReportDetailService,
} from './services';
import { EventsGateway } from './ws/events.gateway';
import { ReportDetail } from './schemas/report-detail.schema';
import { ReportConsumer } from './consumers/report.consumer';
import { OnboardingEventsProducer } from './producers';

@Module({
  controllers: [
    SetupController,
    ReportController,
    TaskCreatedConsumer,
    TaskProcessedConsumer,
    TemplateController,
    ReportConsumer,
    ProcessBulkImportConsumer,
  ],
  imports: [
    HttpModule,
    IntercomModule,
    MongooseModule.forFeature(
      [
        { name: BulkImport.name, schema: BulkImportSchema },
        { name: Task.name, schema: TaskSchema },
        { name: Report.name, schema: ReportSchema },
        { name: ReportDetail.name, schema: ReportDetailSchema }, 
        { name: TemplateSchemaName, schema: TemplateSchema },
      ],
    ),
  ],
  providers: [
    EventsGateway,
    SetupService,
    TaskExecutor,
    ReportExecutor,
    TaskService,
    TemplateService,
    BulkImportService,
    ReportService,
    ReportDetailService,

    // Processors
    AppsProcessor,
    BusinessProcessor,
    CheckoutProcessor,
    ConnectProcessor,
    ConnectSettingsProcessor,
    PosProcessor,
    PreloadMediaProcessor,
    WallpaperProcessor,

    OnboardingEventsProducer,
  ],
})
export class OnboardingModule { }
