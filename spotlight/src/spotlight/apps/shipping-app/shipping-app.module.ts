import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { ShippingProfileMessagesConsumer, ShippingZoneMessagesConsumer } from './consumers';


@Module({
  controllers: [
    ShippingZoneMessagesConsumer,
    ShippingProfileMessagesConsumer,
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [

  ],
})

export class ShippingAppModule { }

