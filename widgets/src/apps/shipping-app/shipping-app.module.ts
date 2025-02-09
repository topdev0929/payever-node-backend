import { Module } from '@nestjs/common';
import { ShippingService } from './services';
import { IntercomModule } from '@pe/nest-kit';

@Module({
  controllers: [
  ],
  exports: [
    ShippingService,
  ],
  imports: [
    IntercomModule,
  ],
  providers: [
    ShippingService,
  ],
})
export class ShippingAppModule { }
