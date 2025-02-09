import { Module } from '@nestjs/common';
import { ShippingModule } from '../shipping/shipping.module';
import { ActionsController } from './controllers';
import { ActionsRetrieverService, ShipGoodsActionResolver } from './services';

@Module({
  controllers: [
    ActionsController,
  ],
  exports: [],
  imports: [
    ShippingModule,
  ],
  providers: [
    ActionsRetrieverService,
    ShipGoodsActionResolver,
  ],

})
export class TransactionActionsModule { }
