import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { DEFAULT_DB_CONNECTION } from '@nestjs/mongoose/dist/mongoose.constants';
import {
  ApmModule,
  CollectorModule,
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  IntercomModule,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { Connection, Model } from 'mongoose';
import { BusinessModule } from '@pe/business-kit';
import { MigrationModule } from '@pe/migration-kit/module/migration.module';

import {
  ApiController,
  ApplicationPosBusMessageController,
  AutoresponderController,
  CheckoutBusMessageController,
  FrontendController,
  IntegrationBusMessageController,
  OnboardingBusMessageController,
  PaymentBusMessageController,
} from './controller';
import { TerminalEmitterConsumer } from './emitter';
import { environment } from './environments';
import { PaymentCode } from './interfaces';
import {
  ApplicationSchema,
  ApplicationSchemaName,
  BusinessSchema,
  BusinessSchemaName,
  CheckoutSchema,
  CheckoutSchemaName,
  PaymentCodeSchema,
  PaymentCodeSchemaName,
} from './schemas';
import {
  AutoresponderService,
  CodeGeneratorService,
  CodeVerifierService,
  CommunicationsService,
  DeliveryService,
  PaymentService,
  PhoneNumberService,
  QrService,
  RabbitProducer,
  ValidatorService,
} from './services';
import {
  IdFactorStep1Strategy,
  IdFactorStep2Strategy,
  PaymentCommonStep2Strategy,
  PaymentCommonStep3Strategy,
  PaymentCommonStrategy,
  PaymentFactorStep1Strategy,
  PaymentFactorStep2Strategy,
} from './services/code-verification-strategies';
import { TransactionsClient } from './services/http/transactions-client.service';
import { BusinessVoter } from './voters';
import { MessageBusChannelsEnum } from './enum';
import { ApplicationShopBusMessageController } from './controller/application-shop-bus-message.controller';
import { ApplicationService } from './services/application.service';

@Module({
  controllers: [
    ApiController,
    AutoresponderController,
    CheckoutBusMessageController,
    OnboardingBusMessageController,
    FrontendController,
    IntegrationBusMessageController,
    PaymentBusMessageController,
    ApplicationPosBusMessageController,
    ApplicationShopBusMessageController,
  ],
  imports: [
    HttpModule,
    CollectorModule,
    BusinessModule.forRoot({
      customSchema: BusinessSchema,
      rabbitChannel: MessageBusChannelsEnum.devicePayments,
    }),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    MongooseModule.forFeature([
      {
        name: ApplicationSchemaName,
        schema: ApplicationSchema,
      },
      {
        name: BusinessSchemaName,
        schema: BusinessSchema,
      },
      {
        name: CheckoutSchemaName,
        schema: CheckoutSchema,
      },
    ]),
    ApmModule.forRoot(environment.apm.enable, environment.apm.options),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusAppPort,
    }),
    CommandModule,
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    RabbitMqModule.forRoot(environment.rabbitmq),
    EventDispatcherModule,
    IntercomModule,
    MigrationModule,
  ],
  providers: [
    AutoresponderService,
    BusinessVoter,
    CodeGeneratorService,
    CodeVerifierService,
    CommunicationsService,
    DeliveryService,
    IdFactorStep1Strategy,
    IdFactorStep2Strategy,
    PaymentCommonStep2Strategy,
    PaymentCommonStep3Strategy,
    PaymentCommonStrategy,
    PaymentFactorStep1Strategy,
    PaymentFactorStep2Strategy,
    PaymentService,
    PhoneNumberService,
    QrService,
    RabbitProducer,
    TerminalEmitterConsumer,
    ApplicationService,
    TransactionsClient,
    ValidatorService,
    {
      inject: [DEFAULT_DB_CONNECTION, RabbitProducer],
      provide: getModelToken(PaymentCodeSchemaName),
      useFactory: (
        connection: Connection,
        rabbitService: RabbitProducer,
      ): Model<PaymentCode> => {
        PaymentCodeSchema.methods.updateAmount = function(
          amount: number,
        ): Promise<any> {
          if (!this.flow) {
            this.flow = { } as never;
          }

          this.flow.amount = amount;

          return Promise.all([
            this.save(),
            rabbitService.transactionPaymentUpdate(this),
          ]);
        };

        PaymentCodeSchema.post('save', async (doc: PaymentCode): Promise<void> => {
          return rabbitService.codeUpdated(doc);
        });

        return connection.model(PaymentCodeSchemaName, PaymentCodeSchema);
      },
    },
  ],
})
export class AppModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
