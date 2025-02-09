import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule } from '../business/business.module';
import { ChannelSetModule } from '../channel-set/channel-set.module';
import { ConnectionModule } from '../connection/connection.module';
import { IntegrationModule } from '../integration/integration.module';
import { AddressController, CheckoutFlowController, FlowChannelSetController, FlowController } from './controllers';
import { FlowService, SendToDeviceService } from './services';
import { FlowToResponseTransformer } from './transformers';
import {
  AmountFilter,
  ApiCallFilter,
  ChannelFilter,
  CountryFilter,
  CurrencyFilter,
  FlowPaymentMethodsFiltersCollector,
  OrganizationFilter,
  ShippingAddressFilter,
  UseDefaultVariantFilter,
} from './filters';
import { CollectorModule } from '@pe/nest-kit';
import { FlowAccessChecker } from './security';
import { AuthClient, GoogleMapsClient } from './clients';
import { CommonModule } from '../common/common.module';
import { FlowSchema, FlowSchemaName } from '../mongoose-schema/schemas/flow';
import { FlowEventsConsumer } from './consumers';
import { SendRabbitEventFlowListener } from './event-listeners';

@Module({
  controllers: [
    AddressController,
    CheckoutFlowController,
    FlowChannelSetController,
    FlowController,
    FlowEventsConsumer,
  ],
  exports: [
    FlowAccessChecker,
    FlowService,
  ],
  imports: [
    CollectorModule,
    HttpModule,
    BusinessModule,
    ChannelSetModule,
    CommonModule,
    ConnectionModule,
    IntegrationModule,
    MongooseModule.forFeature([
      {
        name: FlowSchemaName,
        schema: FlowSchema,
      },
    ]),
  ],
  providers: [
    AmountFilter,
    ApiCallFilter,
    ChannelFilter,
    CountryFilter,
    CurrencyFilter,
    FlowPaymentMethodsFiltersCollector,
    OrganizationFilter,
    ShippingAddressFilter,
    UseDefaultVariantFilter,

    SendRabbitEventFlowListener,

    AuthClient,
    GoogleMapsClient,
    FlowAccessChecker,
    FlowService,
    FlowToResponseTransformer,
    SendToDeviceService,
  ],
})
export class FlowModule { }
