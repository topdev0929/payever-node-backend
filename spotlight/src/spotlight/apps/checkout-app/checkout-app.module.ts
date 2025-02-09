import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { CheckoutMessagesConsumer } from './consumers';

@Module({
  controllers: [
    CheckoutMessagesConsumer,
  ],
  exports: [
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [
  ],
})
export class CheckoutAppModule { }
