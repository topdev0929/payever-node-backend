import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule } from '../business';
import { MongooseSchemas } from './config/mongoose-schemas';
import {
  ProductsBusMessageConsumer,
  SynchronizerBusMessageConsumer,
  TransactionsBusMessageConsumer,
} from './consumers';
import {
  AvailabilityController,
  InventoryController,
  OrderController,
  LocationController,
  AdminLocationsController,
  AdminInventoriesController,
  AdminOrdersController,
} from './controllers';
import { EventProducer } from './producer';
import {
  IntervalHandlerService,
  InventoryService,
  OrderService,
  ReservationService,
  SynchronizeService,
  LocationService,
} from './services';
import {
  InventoryListener,
  InventoryDeleterListener,
  OrderDeleterListener,
  ReservationDeleterListener,
} from './event-listeners';


@Module({
  controllers: [
    // Consumers
    ProductsBusMessageConsumer,
    SynchronizerBusMessageConsumer,
    TransactionsBusMessageConsumer,
    // Controllers
    AvailabilityController,
    InventoryController,
    LocationController,
    OrderController,
    // Admin Controllers
    AdminLocationsController,
    AdminInventoriesController,
    AdminOrdersController,
  ],
  imports: [
    HttpModule,
    BusinessModule,
    MongooseModule.forFeature(MongooseSchemas),
  ],
  providers: [
    // Listeners
    InventoryListener,
    InventoryDeleterListener,
    OrderDeleterListener,
    ReservationDeleterListener,
    // Producers
    EventProducer,
    // Services
    LocationService,
    IntervalHandlerService,
    InventoryService,
    OrderService,
    ReservationService,
    SynchronizeService,
  ],
})
export class InventoryModule { }
