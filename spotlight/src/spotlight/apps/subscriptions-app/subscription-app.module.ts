import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { SubscriptionsMessagesConsumer } from './consumers';


@Module({
  controllers: [
    SubscriptionsMessagesConsumer,
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [

  ],
})

export class SubscriptionsAppModule { }

