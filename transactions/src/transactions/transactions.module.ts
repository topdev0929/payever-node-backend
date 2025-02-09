import { HttpModule, DynamicModule, Module, Type } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModelsNamesEnum, CommonSdkModule } from '@pe/common-sdk';
import { DelayRemoveClient, ElasticSearchModule } from '@pe/elastic-kit';
import { CollectorModule, EventDispatcherModule, IntercomModule } from '@pe/nest-kit';
import { NotificationsSdkModule } from '@pe/notifications-sdk';
import { MigrationModule } from '@pe/migration-kit';
import { FoldersPluginModule } from '@pe/folders-plugin';
import { RulesSdkModule } from '@pe/rules-sdk';
import { LocalBusinessModule } from '../business';

import { environment } from '../environments';
import {
  ExportTransactionToWidgetCommand,
  TransactionsEsBusinessCheckCommand,
  TransactionsEsBusinessUpdateCommand,
  TransactionsEsCompareCommand,
  TransactionsEsExportCommand,
  TransactionsEsFixDiffCommand,
  TransactionsEsSetupCommand,
  TransactionsExportCommand,
  TransactionsExportForBlankMigrateCommand,
  TransactionsExportForWidgetsCommand,
  TransactionsSetupDefaultFoldersCommand,
} from './commands';
import {
  AdminController,
  BusinessController,
  LegacyApiController,
  UserController,
  ProxyController,
  ExportTransactionsController,
  ScheduleSettlementReportController,
  SettlementReportController,
} from './controllers';
import {
  DailyReportTransactionsConsumer,
  HistoryEventsConsumer,
  MailerEventsConsumer,
  MigrateEventsConsumer,
  SampleProductsConsumer,
  ShippingEventsConsumer,
  ThirdPartyEventsConsumer,
  TransactionEventsConsumer,
  InternalTransactionEventsConsumer,
  ExportTransactionsConsumer,
  ExportTransactionsTriggerConsumer,
} from './consumers';
import { ExchangeCalculatorFactory } from './currency';
import { EventListenersList } from './event-listeners/event-listeners.list';
import { TransactionsNotifier } from './notifiers';
import {
  AuthEventsProducer,
  DailyReportTransactionMailerReportEventProducer,
  PaymentMailEventProducer,
  TransactionEventProducer,
} from './producer';
import {
  TransactionExampleSchema,
  TransactionExampleSchemaName,
  TransactionSchema,
  TransactionSchemaName,
  SampleProductSchema,
  SampleProductSchemaName,
  ScheduleSchemaName,
  ScheduleSchema,
  CommonTransactionHistorySchemaName,
  CommonTransactionHistorySchema,
  CancelHistorySchemaName,
  CancelHistorySchema,
  RefundHistorySchema,
  RefundHistorySchemaName,
  ShippingGoodsHistorySchemaName,
  ShippingGoodsHistorySchema,
  SettlementReportFileSchemaName,
  SettlementReportFileSchema,
} from './schemas';
import {
  ActionsRetriever,
  DailyReportTransactionsService,
  DtoValidationService,
  ElasticSearchService,
  MongoSearchService,
  StatisticsService,
  ThirdPartyCallerService,
  SettlementReportScheduleService,
  TransactionActionService,
  TransactionHistoryService,
  TransactionsExampleService,
  TransactionsService,
  SampleProductsService,
  ExportMonthlyBusinessTransactionService,
  ExportUserPerBusinessTransactionService,
  ActionValidatorsList,
  TransactionsInfoService,
  ExporterService,
  ContractService,
  ExporterDynamicService,
  SettlementReportService,
} from './services';
import { EventsGateway } from './ws';
import { RabbitChannels } from '../enums';
import { FiltersConfig, FoldersConfig, RulesOptions } from '../config';
import { ExportMonthlyBusinessTransactionCronService, SettlementReportCronService } from '../crons';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [
    AdminController,
    ScheduleSettlementReportController,
    BusinessController,
    LegacyApiController,
    UserController,
    ProxyController,
    ExportTransactionsController,
    SettlementReportController,

    DailyReportTransactionsConsumer,
    HistoryEventsConsumer,
    MigrateEventsConsumer,
    ThirdPartyEventsConsumer,
    TransactionEventsConsumer,
    ShippingEventsConsumer,
    MailerEventsConsumer,
    SampleProductsConsumer,
    InternalTransactionEventsConsumer,
    ExportTransactionsConsumer,
  ],
  exports: [
    TransactionsService,
    ElasticSearchService,
    ExporterService,
  ],
  imports: [
    ConfigModule,
    HttpModule,
    IntercomModule,
    MongooseModule.forFeature([
      { name: TransactionExampleSchemaName, schema: TransactionExampleSchema },
      { name: TransactionSchemaName, schema: TransactionSchema },
      { name: CommonTransactionHistorySchemaName, schema: CommonTransactionHistorySchema },
      { name: CancelHistorySchemaName, schema: CancelHistorySchema },
      { name: RefundHistorySchemaName, schema: RefundHistorySchema },
      { name: ShippingGoodsHistorySchemaName, schema: ShippingGoodsHistorySchema },
      { name: ScheduleSchemaName, schema: ScheduleSchema },
      { name: SampleProductSchemaName, schema: SampleProductSchema },
      { name: SettlementReportFileSchemaName, schema: SettlementReportFileSchema },
    ]),
    NotificationsSdkModule,
    CommonSdkModule.forRoot({
      channel: RabbitChannels.Transactions,
      consumerModels: [
        CommonModelsNamesEnum.CurrencyModel,
      ],
      filters: FiltersConfig,
      rsaPath: environment.rsa,
    }),
    EventDispatcherModule,
    ElasticSearchModule.forRoot({
      authPassword: environment.elasticSearchAuthPassword,
      authUsername: environment.elasticSearchAuthUsername,
      cloudId: environment.elasticSearchCloudId,
      host: environment.elasticSearchHost,
    }),
    MigrationModule,
    FoldersPluginModule.forFeature(FoldersConfig),
    RulesSdkModule.forRoot(RulesOptions),

    CommonModule,
    LocalBusinessModule,
  ],
  providers: [
    ActionsRetriever,
    AuthEventsProducer,
    CollectorModule,
    ConfigService,
    DailyReportTransactionMailerReportEventProducer,
    DailyReportTransactionsService,
    DelayRemoveClient,
    DtoValidationService,
    ElasticSearchService,
    ExchangeCalculatorFactory,
    ExportTransactionToWidgetCommand,
    MongoSearchService,
    PaymentMailEventProducer,
    PaymentMailEventProducer,
    StatisticsService,
    SampleProductsService,
    ThirdPartyCallerService,
    SettlementReportScheduleService,
    TransactionActionService,
    TransactionEventProducer,
    TransactionHistoryService,
    TransactionsEsBusinessCheckCommand,
    TransactionsEsBusinessUpdateCommand,
    TransactionsEsCompareCommand,
    TransactionsExportCommand,
    TransactionsEsExportCommand,
    TransactionsEsFixDiffCommand,
    TransactionsEsSetupCommand,
    TransactionsExampleService,
    TransactionsExportForBlankMigrateCommand,
    TransactionsExportForWidgetsCommand,
    TransactionsSetupDefaultFoldersCommand,
    TransactionsNotifier,
    TransactionsService,
    ...EventListenersList,
    EventsGateway,
    ExportMonthlyBusinessTransactionService,
    ExportUserPerBusinessTransactionService,
    ...ActionValidatorsList,
    TransactionsInfoService,
    ExportMonthlyBusinessTransactionCronService,
    SettlementReportCronService,
    ExporterService,
    ExporterDynamicService,
    ContractService,
    SettlementReportService,
  ],
})
export class TransactionsModule {
  public static forRoot(): DynamicModule {
    const controllers: Array<Type<any>> = [];
    if (environment.rabbitmq.rabbitTransactionsQueueName) {
      controllers.push(ExportTransactionsTriggerConsumer);
    }

    return {
      controllers: [
        ...controllers,
      ],
      module: TransactionsModule,
    };
  }
}
