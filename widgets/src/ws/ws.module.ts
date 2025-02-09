import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';
import { BusinessModule } from '../business';
import { UserModule } from '../user';
import { WidgetModule } from '../widget';
import { BlogAppModule } from '../apps/blog-app';
import { CheckoutAppModule } from '../apps/checkout-app';
import { ConnectAppModule } from '../apps/connect-app';
import { PosAppModule } from '../apps/pos-app';
import { ProductsAppModule } from '../apps/products-app';
import { ShopAppModule } from '../apps/shop-app';
import { SiteAppModule } from '../apps/site-app';
import { StudioAppModule } from '../apps/studio-app';
import { TransactionsAppModule } from '../apps/transactions-app';
import { InvoiceAppModule } from '../apps/invoice-app';
import { MessageAppModule } from '../apps/message-app';
import { EventListenerService } from './listeners';
import { EventDispatcherModule } from '@pe/nest-kit';
import { ShippingAppModule } from '../apps/shipping-app';
import { CouponAppModule } from '../apps/coupon-app';
import { ContactAppModule } from '../apps/contact-app';
import { SubscriptionAppModule } from '../apps/subscriptions-app';
import { AppointmentModule } from '../apps/appointment-app';
import { SocialModule } from '../apps/social-app';

@Module({
  controllers: [
  ],
  exports: [
  ],
  imports: [
    JwtModule,
    EventDispatcherModule,

    BusinessModule,
    CheckoutAppModule,
    ConnectAppModule,
    PosAppModule,
    ProductsAppModule,
    ShopAppModule,
    SiteAppModule,
    BlogAppModule,
    StudioAppModule,
    ShippingAppModule,
    TransactionsAppModule,
    InvoiceAppModule,
    UserModule,
    CouponAppModule,
    ContactAppModule,
    MessageAppModule,
    WidgetModule,
    SubscriptionAppModule,
    AppointmentModule,
    SocialModule,
  ],
  providers: [
    EventsGateway,
    EventsService,

    EventListenerService,
  ],
})
export class WSModule { }
