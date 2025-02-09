import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessModule } from '@pe/business-kit';
import { CommonSdkModule } from '@pe/common-sdk';

import { AdminSpotlightController, SpotlightController } from './controllers';
import {
  BillingSubscriptionService,
  BlogService,
  CheckoutService,
  ContactService,
  DashboardService,
  ElasticDocumentIndexService,
  IntegrationService,
  InvoiceService,
  MessageService,
  ProductService,
  ShippingOrderService,
  ShopService,
  SiteService,
  SpotlightService,
  TerminalService,
  TransactionService,
  UserService,
} from './services';
import { environment, RabbitChannelsEnum } from '../environments';
import { SpotlightClearAppDataCommand, SpotlightEsInitialExportCommand, SpotlightEsSetupCommand } from './commands';
import { AppSchema, AppSchemaName, SpotlightSchema, SpotlightSchemaName } from './schemas';
import { BlogAppModule } from './apps/blog-app';
import { ContactAppModule } from './apps/contact-app';
import { CheckoutAppModule } from './apps/checkout-app';
import { AppointmentAppModule } from './apps/appointment-app';
import { CouponAppModule } from './apps/coupon-app';
import { InvoiceAppModule } from './apps/invoice-app';
import { MessageAppModule } from './apps/message-app';
import { PosAppModule } from './apps/pos-app';
import { ProductsAppModule } from './apps/products-app';
import { TransactionsAppModule } from './apps/transactions-app';
import { BusinessAppModule } from './apps/business-app';
import { UserAppModule } from './apps/users-app';
import { SiteAppModule } from './apps/site-app';
import { ShopAppModule } from './apps/shop-app/shop-app.module';
import { ShippingAppModule } from './apps/shipping-app/shipping-app.module';
import { SubscriptionsAppModule } from './apps/subscriptions-app';
import { AffiliateAppModule } from './apps/affiliate-app';
import { ConnectAppModule } from './apps/connect-app/connect-app.module';
import { SocialAppModule } from './apps/social-app/social-app.module';
import { StudioAppModule } from './apps/studio-app/studio-app.module';

@Module({
  controllers: [
    SpotlightController,
    AdminSpotlightController,
  ],
  exports: [
    SpotlightService,
  ],
  imports: [
    BusinessModule.forRoot({
      rabbitChannel: RabbitChannelsEnum.Spotlight,
    }),
    MongooseModule.forFeature([
      { name: AppSchemaName, schema: AppSchema },
      { name: SpotlightSchemaName, schema: SpotlightSchema },
    ]),
    CommonSdkModule.forRoot({
      channel: RabbitChannelsEnum.Spotlight,
      consumerModels: [],
      rsaPath: environment.rsa,
    }),
    forwardRef(() => BlogAppModule),
    forwardRef(() => ContactAppModule),
    forwardRef(() => CheckoutAppModule),
    forwardRef(() => AppointmentAppModule),
    forwardRef(() => CouponAppModule),
    forwardRef(() => InvoiceAppModule),
    forwardRef(() => MessageAppModule),
    forwardRef(() => PosAppModule),
    forwardRef(() => ProductsAppModule),
    forwardRef(() => TransactionsAppModule),
    forwardRef(() => BusinessAppModule),
    forwardRef(() => UserAppModule),
    forwardRef(() => SiteAppModule),
    forwardRef(() => ShopAppModule),
    forwardRef(() => ShippingAppModule),
    forwardRef(() => SubscriptionsAppModule),
    forwardRef(() => StudioAppModule),
    forwardRef(() => AffiliateAppModule),
    forwardRef(() => ConnectAppModule),
    forwardRef(() => SocialAppModule),
  ],
  providers: [
    SpotlightClearAppDataCommand,
    SpotlightEsInitialExportCommand,
    SpotlightEsSetupCommand,
    ElasticDocumentIndexService,
    BillingSubscriptionService,
    BlogService,
    CheckoutService,
    ContactService,
    DashboardService,
    IntegrationService,
    InvoiceService,
    MessageService,
    ProductService,
    ShippingOrderService,
    ShopService,
    SiteService,
    SpotlightService,
    TerminalService,
    TransactionService,
    UserService,
  ],
})
export class SpotlightModule { }
