import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseSchemas } from './config';
import {
  PaymentBusMessageController,
  PaymentFlowBusMessageController,
  ApiCallBusMessageController,
  OAuthTokenBusMessageController,
} from './controllers';
import {
  CheckoutMetricsService,
  ConversionFormReportManager,
  ConversionReportManager,
  CurrencyExchangeService,
  PaymentService,
  TelegramMessenger,
  VolumeChannelsReportManager,
  VolumeMerchantsReportManager,
  VolumeReportCheckoutFormMetricsRetriever,
  VolumeReportCheckoutMetricsRetriever,
  VolumeReportManager,
  VolumeReportSender,
  VolumeReportSpreadsheetGenerator,
  VolumeReportTransactionsRetriever,
  VolumeTransactionsReportManager,
  RabbitMqService,
  DevicesReportManager,
  ChartsReportManager,
  ApiCallService,
  VolumeReportApiCallRetriever,
  ResponseTimeReportManager,
  OAuthTokenService,
  VolumeReportOAuthTokenRetriever,
  ReportDbManager,
  CheckoutFormMetricsService,
} from './services';
import { SaveReportToDbCommand, SendSantanderVolumeReportEmailCommand } from './commands';
import { LastTransactionTimeCron, MissingTransactionsCron, ReportToDbCron, VolumeReportCron } from './cron';
import { TelegramModule } from 'nestjs-telegram';
import { environment } from '../environments';
import { BusinessModule } from '../business/business.module';

@Module({
  controllers: [
    PaymentFlowBusMessageController,
    PaymentBusMessageController,
    ApiCallBusMessageController,
    OAuthTokenBusMessageController,
  ],
  exports: [],
  imports: [
    BusinessModule,
    MongooseModule.forFeature(MongooseSchemas),
    TelegramModule.forRoot({
      botKey: environment.telegramAccessToken,
    }),
  ],
  providers: [
    RabbitMqService,
    CheckoutMetricsService,
    ConversionFormReportManager,
    ConversionReportManager,
    CurrencyExchangeService,
    LastTransactionTimeCron,
    MissingTransactionsCron,
    CheckoutFormMetricsService,
    PaymentService,
    SendSantanderVolumeReportEmailCommand,
    TelegramMessenger,
    VolumeChannelsReportManager,
    VolumeReportCheckoutFormMetricsRetriever,
    VolumeReportCheckoutMetricsRetriever,
    VolumeReportCron,
    VolumeReportManager,
    VolumeReportSender,
    VolumeReportTransactionsRetriever,
    VolumeReportSpreadsheetGenerator,
    VolumeTransactionsReportManager,
    VolumeMerchantsReportManager,
    DevicesReportManager,
    ChartsReportManager,
    ApiCallService,
    VolumeReportApiCallRetriever,
    ResponseTimeReportManager,
    OAuthTokenService,
    VolumeReportOAuthTokenRetriever,
    ReportDbManager,
    ReportToDbCron,
    SaveReportToDbCommand,
  ],
})
export class CheckoutAnalyticsModule { }
