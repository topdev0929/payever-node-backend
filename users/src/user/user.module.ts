import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModelsNamesEnum, CommonSdkModule } from '@pe/common-sdk';
import { MediaSdkModule } from '@pe/media-sdk';
import { NotificationsSdkModule } from '@pe/notifications-sdk';
import { environment } from '../environments';
import {
  BusinessExportCommand,
  BusinessOwnerMigrateCommand,
  CheckAssignedImagesCommand,
  FillDefaultLanguageForBusinessCommand,
  RemoveTrialUsersCommand,
  UserEsExportCommand,
  UserExportCommand,
} from './commands';
import {
  AdminBusinessController,
  AdminController,
  BusinessController,
  SlugController,
  TrustedDomainController,
  UserController,
} from './controllers';
import {
  BusinessConsumer,
  BusinessReportsConsumer,
  BusinessRpcConsumer,
  CommerceosConsumer,
  UserConsumer,
  UserRpcConsumer,
  WallpaperConsumer,
} from './consumers';
import {
  BusinessMediaChangedListener,
  BusinessRegistrationFinishedListener,
  EnableBusinessOnCreateListener,
  SendBusinessCreatedRabbitMessageListener,
  SendTrustedDomainRabbitMessageListener,
  UserEventsListener,
  UserMediaChangedListener,
} from './event-listeners';
import { SlugRedirectInterceptor } from './interceptors/slug-redirect.interceptor';
import {
  BusinessEventsProducer,
  MailerEventProducer,
  TrustedDomainEventProducer,
  UserEventsProducer,
} from './producers';
import {
  BusinessActiveSchema,
  BusinessActiveSchemaName,
  BusinessDetailSchema,
  BusinessDetailSchemaName,
  BusinessSchema,
  BusinessSchemaName,
  BusinessSlugSchema,
  BusinessSlugSchemaName,
  EmailSettingsSchema,
  EmailSettingsSchemaName,
  TrafficSourceSchema,
  TrafficSourceSchemaName,
  TrustedDomainSchema,
  TrustedDomainSchemaName,
  UserSchema,
  UserSchemaName,
} from './schemas';
import {
  BusinessAppInstallationSchema,
  BusinessAppInstallationSchemaName,
} from './schemas/business-app-installation.schema';
import {
  BusinessAppInstallationService,
  BusinessExporterService,
  BusinessListRetriever,
  BusinessService,
  CountryInfoService,
  TrafficSourceService,
  TrialUserService,
  TrustedDomainService,
  UserElasticService,
  UserService,
} from './services';
import { MessageBusChannelsEnum } from './enums';
import { EmployeesModule } from '../employees/employees.module';
import { BusinessExportReportCron, TrialUserRemoverCron } from './cron';

@Module({
  controllers: [
    AdminController,
    AdminBusinessController,
    BusinessController,
    BusinessReportsConsumer,
    SlugController,
    UserController,
    TrustedDomainController,

    BusinessRpcConsumer,
    BusinessConsumer,
    CommerceosConsumer,
    UserConsumer,
    UserRpcConsumer,
    WallpaperConsumer,
  ],
  exports: [
    BusinessService,
    BusinessAppInstallationService,
    UserService,
  ],
  imports: [
    HttpModule,

    MongooseModule.forFeature([
      {
        name: UserSchemaName,
        schema: UserSchema,
      },
      {
        name: BusinessDetailSchemaName,
        schema: BusinessDetailSchema,
      },
      {
        name: BusinessSchemaName,
        schema: BusinessSchema,
      },
      {
        name: BusinessSlugSchemaName,
        schema: BusinessSlugSchema,
      },
      {
        name: BusinessAppInstallationSchemaName,
        schema: BusinessAppInstallationSchema,
      },
      {
        name: TrafficSourceSchemaName,
        schema: TrafficSourceSchema,
      },
      {
        name: EmailSettingsSchemaName,
        schema: EmailSettingsSchema,
      },
      {
        name: BusinessActiveSchemaName,
        schema: BusinessActiveSchema,
      },
      {
        name: TrustedDomainSchemaName,
        schema: TrustedDomainSchema,
      },
    ]),
    MediaSdkModule,
    EmployeesModule,
    CommonSdkModule.forRoot({
      channel: MessageBusChannelsEnum.users,
      consumerModels: [
        CommonModelsNamesEnum.CountryModel,
        CommonModelsNamesEnum.CurrencyModel,
        CommonModelsNamesEnum.LanguageModel,
        CommonModelsNamesEnum.LegalDocumentModel,
      ],
      rsaPath: environment.rsa,
    }),
    NotificationsSdkModule,
  ],
  providers: [
    // Commands
    RemoveTrialUsersCommand,
    BusinessExportCommand,
    CheckAssignedImagesCommand,
    FillDefaultLanguageForBusinessCommand,
    UserEsExportCommand,
    BusinessOwnerMigrateCommand,
    UserExportCommand,
    // Listeners
    BusinessMediaChangedListener,
    BusinessRegistrationFinishedListener,
    EnableBusinessOnCreateListener,
    SendBusinessCreatedRabbitMessageListener,
    SendTrustedDomainRabbitMessageListener,
    UserMediaChangedListener,
    UserEventsListener,
    // Producers
    BusinessEventsProducer,
    BusinessListRetriever,
    BusinessExporterService,
    MailerEventProducer,
    TrustedDomainEventProducer,
    UserEventsProducer,
    // Services
    TrialUserService,
    BusinessAppInstallationService,
    BusinessService,
    CountryInfoService,
    UserElasticService,
    TrafficSourceService,
    UserService,
    TrustedDomainService,
    // Others
    SlugRedirectInterceptor,
    // cron
    BusinessExportReportCron,
    TrialUserRemoverCron,
  ],
})
export class UserModule { }
