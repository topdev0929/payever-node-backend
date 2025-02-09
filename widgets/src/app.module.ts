import { BadRequestException, HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { JwtAuthModule } from '@pe/nest-kit/modules/auth';
import { ErrorHandlersEnum, ErrorsHandlerModule } from '@pe/nest-kit/modules/errors-handler';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { MutexModule } from '@pe/nest-kit/modules/mutex';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { Error } from 'mongoose';
import { BussMessagesModule } from './bus-messages';
import { BusinessModule } from './business';
import { environment } from './environments';
import { StatisticsModule } from './statistics';
import { TestModule } from './test-module';
import { UserModule } from './user';
import { WidgetModule } from './widget';
import { WSModule } from './ws/ws.module';
import { BlogAppModule } from './apps/blog-app';
import { CheckoutAppModule } from './apps/checkout-app';
import { ConnectAppModule } from './apps/connect-app';
import { MarketingAppModule } from './apps/marketing-app';
import { PosAppModule } from './apps/pos-app';
import { ProductsAppModule } from './apps/products-app';
import { ShopAppModule } from './apps/shop-app';
import { SiteAppModule } from './apps/site-app';
import { StudioAppModule } from './apps/studio-app';
import { TransactionsAppModule } from './apps/transactions-app';
import { MessageAppModule } from './apps/message-app';
import { ShippingAppModule } from './apps/shipping-app';
import { CouponAppModule } from './apps/coupon-app';
import { ContactAppModule } from './apps/contact-app';
import { InvoiceAppModule } from './apps/invoice-app';
import { MigrationModule } from '@pe/migration-kit';

@Module({
  imports: [
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    ErrorsHandlerModule.forRoot([{
      exceptions: [BadRequestException],
      name: ErrorHandlersEnum.dtoValidation,
    }, {
      exceptions: [Error.ValidationError],
      name: ErrorHandlersEnum.uniqueEntity,
    }]),
    HttpModule,
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    RabbitMqModule.forRoot(environment.rabbitmq),
    MutexModule,
    BusinessModule,
    BussMessagesModule,
    CommandModule,
    ConnectAppModule,
    EventDispatcherModule,
    MarketingAppModule,
    ProductsAppModule,
    StatisticsModule,
    ShippingAppModule,
    TestModule,
    TransactionsAppModule,
    InvoiceAppModule,
    UserModule,
    WidgetModule,
    StudioAppModule,
    CheckoutAppModule,
    PosAppModule,
    ShopAppModule,
    SiteAppModule,
    BlogAppModule,
    CouponAppModule,
    ContactAppModule,
    MessageAppModule,
    WSModule,
    MigrationModule.forRoot({ }),
  ],
})

export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
