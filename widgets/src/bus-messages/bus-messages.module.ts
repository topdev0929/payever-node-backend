import { HttpModule, Module } from '@nestjs/common';
import { BusinessModule } from '../business';
import { MarketingAppModule } from '../apps/marketing-app';
import { ProductsAppModule } from '../apps/products-app';
import { TransactionsAppModule } from '../apps/transactions-app';
import { InvoiceAppModule } from '../apps/invoice-app';

import { BusMessageController } from './controller';
import { WidgetsEventsProducer } from './producers/widgets-events-producer.producer';

@Module({
  controllers: [
    BusMessageController,
  ],
  exports: [
  ],
  imports: [
    HttpModule,
    BusinessModule,
    ProductsAppModule,
    TransactionsAppModule,
    InvoiceAppModule,
    MarketingAppModule,
  ],
  providers: [
    WidgetsEventsProducer,
  ],
})
export class BussMessagesModule { }
