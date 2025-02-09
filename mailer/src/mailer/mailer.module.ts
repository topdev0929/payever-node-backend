import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModelsNamesEnum, CommonSdkModule } from '@pe/common-sdk';
import { environment } from '../environments';
import {
  AuthConsumer,
  AuthMailTransformer,
  CampaignMailService,
  EmailRenderer,
  IntegrationMailController,
  MailerEventController,
  PaymentMailTransformer,
  PaymentService,
  SenderService,
  SingleMailService,
  SingleMailTransformer,
  UserConsumer,
  InvoiceService,
  InvoiceMailTransformer, UserController,
} from './';
import { UpdateTemplateCommand } from './commands';
import { BankAccountListener } from './event-listeners';
import {
  BankAccountSchema,
  BusinessSchema,
  BusinessSchemaName,
  IntegrationAccessSchema,
  IntegrationAccessSchemaName,
  LogSchema,
  LogSchemaName,
  TemplateSchema,
  TemplateSchemaName,
  UserSchema,
  UserSchemaName,
  MailServerConfigSchema,
  MailServerConfigSchemaName,
  PaymentMailSchema,
  PaymentMailSchemaName, BankAccountSchemaName,
} from './schemas';
import { BankAccountService, BusinessService, PaymentMailService, TemplateService, UserService } from './services';
import { NodeMailerWrapper } from './services/node-mailer.wrapper';
import { ApmModule, ApmService } from '@pe/nest-kit';
import { BusinessMailTransformer, UserMailTransformer } from './transformers';
import { MailerEventsProducer } from './producers';
import { AdminTemplatesController, PaymentMailController } from './controllers';
import { MessageBusChannelsEnum } from './enum';
import { BusinessModule } from '@pe/business-kit';
import { IntegrationAccessValidator } from './access-validators';
@Module({
  controllers: [
    AuthConsumer,
    UserConsumer,
    UserController,
    MailerEventController,
    PaymentMailController,
    IntegrationMailController,
    AdminTemplatesController,
  ],
  exports: [PaymentMailTransformer, EmailRenderer],
  imports: [
    HttpModule,
    BusinessModule.forRoot({
      customSchema: BusinessSchema,
      rabbitChannel: MessageBusChannelsEnum.mailer,
    }),
    MongooseModule.forFeature([
      {
        name: TemplateSchemaName,
        schema: TemplateSchema,
      },
      {
        name: BusinessSchemaName,
        schema: BusinessSchema,
      },
      {
        name: LogSchemaName,
        schema: LogSchema,
      },
      {
        name: BankAccountSchemaName,
        schema: BankAccountSchema,
      },
      {
        name: UserSchemaName,
        schema: UserSchema,
      },
      {
        name: PaymentMailSchemaName,
        schema: PaymentMailSchema,
      },
      {
        name: IntegrationAccessSchemaName,
        schema: IntegrationAccessSchema,
      },
      {
        name: MailServerConfigSchemaName,
        schema: MailServerConfigSchema,
      },
    ]),
    CommonSdkModule.forRoot({
      channel: MessageBusChannelsEnum.mailer,
      consumerModels: [CommonModelsNamesEnum.CountryModel, CommonModelsNamesEnum.CurrencyModel],
      rsaPath: environment.rsa,
    }),
    ApmModule.forRoot(environment.apm.enable, environment.apm.options),
    ApmService,
  ],
  providers: [
    UpdateTemplateCommand,
    ApmService,
    PaymentMailTransformer,
    BusinessMailTransformer,
    EmailRenderer,
    MailerEventsProducer,
    SenderService,
    SingleMailService,
    SingleMailTransformer,
    PaymentService,
    PaymentMailService,
    BusinessService,
    BankAccountService,
    BankAccountListener,
    NodeMailerWrapper,
    CampaignMailService,
    UserService,
    UserMailTransformer,
    AuthMailTransformer,
    InvoiceService,
    InvoiceMailTransformer,
    TemplateService,
    IntegrationAccessValidator,
  ],
})
export class MailerModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
