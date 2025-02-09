import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { WidgetDeleteVoter, WidgetEditVoter } from './voters';
import {
  ServiceUrlRetriever,
  WidgetsService,
  WidgetsPaymentService,
  ThirdPartyCallerService,
  CacheManager,
} from './services';
import {
  WidgetsController,
  WidgetsManagementController,
  WidgetsPaymentController,
  SupportedPaymentOptionsController,
} from './controllers';
import { WidgetSchema, WidgetSchemaName } from './schemas';
import { FinanceExpressConsumer } from './consumers';
import { BusinessModule } from '../business/';
import { IntercomModule } from '@pe/nest-kit';

@Module({
  controllers: [
    WidgetsController,
    WidgetsManagementController,
    FinanceExpressConsumer,
    WidgetsPaymentController,
    SupportedPaymentOptionsController,
  ],
  exports: [],
  imports: [
    HttpModule,
    IntercomModule,
    MongooseModule.forFeature([
      { name: WidgetSchemaName, schema: WidgetSchema },
    ]),
    BusinessModule,
  ],
  providers: [
    CacheManager,
    ConfigService,
    ServiceUrlRetriever,
    WidgetsPaymentService,
    WidgetDeleteVoter,
    WidgetEditVoter,
    WidgetsService,
    ThirdPartyCallerService,
  ],
})
export class FinanceExpressModule { }
