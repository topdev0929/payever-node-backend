import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { AffiliateMessagesConsumer } from './consumers';


@Module({
  controllers: [
    AffiliateMessagesConsumer,
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [

  ],
})

export class AffiliateAppModule { }

