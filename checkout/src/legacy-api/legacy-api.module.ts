import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntercomModule } from '@pe/nest-kit';
import { BusinessModule } from '../business/business.module';
import { ChannelSetModule } from '../channel-set/channel-set.module';
import { ConnectionModule } from '../connection/connection.module';
import { IntegrationModule } from '../integration/integration.module';
import {
  ActionApiCallSchema,
  ActionApiCallSchemaName,
  ApiCallSchema,
  ApiCallSchemaName,
  BusinessSchema,
  BusinessSchemaName,
  CheckoutSchema,
  CheckoutSchemaName,
  OrderSchema,
  OrderSchemaName,
  Payment2faPinSchema,
  Payment2faPinSchemaName,
  PaymentCodeSchema,
  PaymentCodeSchemaName,
  PaymentSchema,
  PaymentSchemaName,
  PaymentLinkSchemaName,
} from '../mongoose-schema';
import { ActionApiCallsExportCommand } from './commands/action-api-calls-export.command';
import {
  ApiCallController,
  PaymentController,
  PaymentOptionsController,
  ShopController,
  V2PaymentController,
  V2PaymentLinksController,
  V3PaymentController,
  PaymentLinksCheckoutController,
  B2bController,
  V3PaymentLinksController,
  TransactionDataController,
  V3ActionsController,
} from './controllers';
import {
  SendRabbitEventActionApiCallListener,
  ConvertCustomVerifyActionListener,
  GenerateVerifyCodeApiCallListenerService,
  SendRedirectUrlEmailListener,
  SendRedirectUrlSmsListener,
  Verify2faPinActionListener,
  VerifyCodeActionListener,
} from './event-listeners';
import { AccessTokenMiddleware, MultipartPaymentMiddleware } from './middleware';
import { LegacyApiEventsProducer } from './producer';
import {
  LegacyApiResponseTransformerService,
  LegacyApiProcessor,
  LegacyBusinessResolverService,
  PaymentCodeService,
  PaymentMethodService,
  PaymentService,
  ThirdPartyExternalPaymentCaller,
  SendEmailService,
  SendSmsService,
  PaymentActionService,
  Payment2faPinService,
  ExternalApiExecutor,
  TermsService,
} from './services';
import { TranslationsSdkModule } from '@pe/translations-sdk';
import { SupportedLocalesEnum } from '@pe/translations-sdk/module/enums';
import { environment } from '../environments';
import { CommonModule } from '../common/common.module';
import { CreatePaymentValidator, PaymentMethodVariantValidator } from './validation';
import { FlowModule } from '../flow/flow.module';
import { OrderService } from './services/order.service';
import { PaymentOrderValidator } from './validation/payment-order.validator';
import { CreatePaymentDtoTransformer } from './transformer/create-payment-dto.transformer';
import { OrderConsumer } from './consumers/order.consumer';
import { ErrorCodeService } from './services/error-code.service';
import { PaymentLinksSchema } from '../mongoose-schema/schemas/payment-links.schema';
import { PaymentLinksModule } from '../payment-links/payment-links.module';
import { LegacyPaymentLinksService } from './services/legacy-payment-links.service';
import { PaymentConsumer } from './consumers/payment.consumer';

@Module({
  controllers: [
    OrderConsumer,
    PaymentConsumer,

    ApiCallController,
    B2bController,
    PaymentController,
    PaymentOptionsController,
    ShopController,
    V2PaymentController,
    V3PaymentController,
    V3ActionsController,
    V2PaymentLinksController,
    V3PaymentLinksController,
    PaymentLinksCheckoutController,
    TransactionDataController,
  ],
  exports: [
    ExternalApiExecutor,
    PaymentService,
  ],
  imports: [
    BusinessModule,
    ChannelSetModule,
    CommonModule,
    ConnectionModule,
    HttpModule,
    IntegrationModule,
    IntercomModule,
    FlowModule,
    PaymentLinksModule,
    MongooseModule.forFeature([
      {
        name: ActionApiCallSchemaName,
        schema: ActionApiCallSchema,
      },
      {
        name: ApiCallSchemaName,
        schema: ApiCallSchema,
      },
      {
        name: CheckoutSchemaName,
        schema: CheckoutSchema,
      },
      {
        name: PaymentSchemaName,
        schema: PaymentSchema,
      },
      {
        name: PaymentCodeSchemaName,
        schema: PaymentCodeSchema,
      },
      {
        name: Payment2faPinSchemaName,
        schema: Payment2faPinSchema,
      },
      {
        name: BusinessSchemaName,
        schema: BusinessSchema,
      },
      {
        name: OrderSchemaName,
        schema: OrderSchema,
      },
      {
        name: PaymentLinkSchemaName,
        schema: PaymentLinksSchema,
      },
    ]),
    TranslationsSdkModule.forFeature({
      domains: [
        'payment_option',
        'frontend-payment-options.santander-fact-de-app',
        'frontend-payments-options.santander-invoice-de-app',
        'frontend-payments-options.santander-de-app',
      ],
      env: {
        translationsApi: `${environment.microUrlTranslationStorage}/translations`,
      },
      locales: [
        SupportedLocalesEnum.en,
        SupportedLocalesEnum.de,
        SupportedLocalesEnum.da,
        SupportedLocalesEnum.es,
        SupportedLocalesEnum.no,
        SupportedLocalesEnum.sv,
      ],
    }),
  ],
  providers: [
    OrderService,

    ActionApiCallsExportCommand,

    SendRabbitEventActionApiCallListener,
    ConvertCustomVerifyActionListener,
    GenerateVerifyCodeApiCallListenerService,
    Verify2faPinActionListener,
    VerifyCodeActionListener,
    SendRedirectUrlEmailListener,
    SendRedirectUrlSmsListener,

    CreatePaymentValidator,
    PaymentMethodVariantValidator,
    PaymentOrderValidator,

    CreatePaymentDtoTransformer,
    ExternalApiExecutor,
    LegacyApiEventsProducer,
    LegacyApiResponseTransformerService,
    LegacyBusinessResolverService,
    PaymentMethodService,
    PaymentService,
    ThirdPartyExternalPaymentCaller,
    LegacyApiProcessor,
    SendEmailService,
    SendSmsService,
    PaymentCodeService,
    PaymentActionService,
    Payment2faPinService,
    TermsService,
    ErrorCodeService,

    LegacyPaymentLinksService,
  ],
})
export class LegacyApiModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(MultipartPaymentMiddleware, AccessTokenMiddleware)
      .forRoutes(PaymentController)
    ;
  }
}
