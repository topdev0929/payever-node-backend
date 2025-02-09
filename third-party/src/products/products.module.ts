import { Module } from '@nestjs/common';

import { BusinessModule } from '../business/business.module';
import { InventoryController, ProductController, SynchronizerBusMessageController } from './controllers';
import { EventProducer } from './producer';

@Module({
  controllers: [
    InventoryController,
    ProductController,
    SynchronizerBusMessageController,
  ],
  imports: [
    BusinessModule,
  ],
  providers: [
    EventProducer,
  ],
})
export class ProductsModule { }
