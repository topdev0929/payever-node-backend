import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CronService, EtlService } from './services';
import { Loader, MongodbAdapter } from './common';
import {
  PaymentSchema,
  PaymentSchemaName,
} from './schemas';
import { environment } from '../environments';
import { StatisticsModule } from '../statistics/statistics.module';
import { EventDispatcherModule } from '@pe/nest-kit';
import { CronController } from './controllers';
import { ShopEventsSchemaName, ShopEventsSchema } from './schemas/shop-events.schema';
import { SiteEventsSchemaName, SiteEventsSchema } from './schemas/site-events.schema';
import { PosEventsSchemaName, PosEventsSchema } from './schemas/pos-events.schema';
import { SubscriptionsEventsSchemaName, SubscriptionsEventsSchema } from './schemas/subscriptions-events.schema';
import { MessageEventsSchemaName, MessageEventsSchema } from './schemas/message-events.schema';
import { BlogEventsSchemaName, BlogEventsSchema } from './schemas/blog-events.schema';
import { TransactionMessagesConsumer } from './consumers';

@Module({
  controllers: [
    CronController,
    TransactionMessagesConsumer,
  ],
  exports: [],
  imports: [
    MongooseModule.forFeature([
      { name: PaymentSchemaName, schema: PaymentSchema },
      { name: ShopEventsSchemaName, schema: ShopEventsSchema },
      { name: SiteEventsSchemaName, schema: SiteEventsSchema},
      { name: PosEventsSchemaName, schema: PosEventsSchema},
      { name: SubscriptionsEventsSchemaName, schema: SubscriptionsEventsSchema},
      { name: MessageEventsSchemaName, schema: MessageEventsSchema},
      { name: BlogEventsSchemaName, schema: BlogEventsSchema},
    ]),
    EventDispatcherModule,
    MongooseModule.forRoot(
      environment.mongodb,
      {
        useUnifiedTopology: true,
      },
    ),
    StatisticsModule,
  ],
  providers: [
    CronService,
    Loader,
    MongodbAdapter,
    EtlService,
  ],
})
export class EtlModule { }
