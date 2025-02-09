import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EventDispatcherModule } from '@pe/nest-kit';
import { FoldersPluginModule } from '@pe/folders-plugin';
import { RulesSdkModule } from '@pe/rules-sdk';
import { DashboardEsExportCommand } from './commands';
import { FoldersConfig, RulesOptions } from './config';
import {
  AdminController,
  BusinessController,
  DashboardController,
  DimensionController,
  MetricController,
  StatisticsController,
  WidgetController,
  WidgetDataController,
} from './controllers';
import { CubeDataListener, DashboardListener } from './event-listener';
import {
  BusinessSchema,
  BusinessSchemaName,
  ChannelSetSchema,
  ChannelSetSchemaName,
  DashboardSchema,
  DashboardSchemaName,
  DimensionSchema,
  DimensionSchemaName,
  MetricSchema,
  MetricSchemaName,
  WidgetSchema,
  WidgetSchemaName,
  WidgetPropsSchema,
  WidgetPropsSchemaName,
  BrowserSchema,
  BrowserSchemaName,
  IntegrationSchema,
  IntegrationSchemaName,
  CubeSchema,
  CubeSchemaName,
} from './schemas';
import {
  CubeService,
  DashboardElasticService,
  DashboardService,
  DefaultWidgetsService,
  DimensionService,
  MetricService,
  StatisticsService,
  WidgetService,
} from './services';
import { EventsGateway } from './ws';
import { BusinessServiceHelper } from './helpers/business.helper';
import { IntegrationService } from './services/integration.service';
import { ShopsModule } from '../shops/shops.module';
import { PosModule } from '../pos/pos.module';
import { SiteModule } from '../sites/site.module';

@Module({
  controllers: [
    DashboardController,
    DimensionController,
    MetricController,
    StatisticsController,
    WidgetController,
    WidgetDataController,
    BusinessController,
    AdminController,
  ],
  exports: [
    IntegrationService,
  ],
  imports: [
    EventDispatcherModule,
    FoldersPluginModule.forFeature(FoldersConfig),
    RulesSdkModule.forRoot(RulesOptions),
    MongooseModule.forFeature([
      { name: BusinessSchemaName, schema: BusinessSchema },
      { name: ChannelSetSchemaName, schema: ChannelSetSchema },
      { name: DashboardSchemaName, schema: DashboardSchema },
      { name: DimensionSchemaName, schema: DimensionSchema },
      { name: MetricSchemaName, schema: MetricSchema },
      { name: BrowserSchemaName, schema: BrowserSchema },
      { name: CubeSchemaName, schema: CubeSchema },
      { name: WidgetSchemaName, schema: WidgetSchema },
      { name: WidgetPropsSchemaName, schema: WidgetPropsSchema },
      { name: IntegrationSchemaName, schema: IntegrationSchema },
    ]),
    ShopsModule,
    PosModule,
    SiteModule,
  ],
  providers: [
    DashboardEsExportCommand,
    // Listeners
    CubeDataListener,
    DashboardListener,
    //
    EventsGateway,
    BusinessServiceHelper,
    // Services
    DefaultWidgetsService,
    DashboardElasticService,
    DashboardService,
    DimensionService,
    MetricService,
    StatisticsService,
    IntegrationService,
    WidgetService,
    CubeService,
  ],
})
export class StatisticsModule { }
