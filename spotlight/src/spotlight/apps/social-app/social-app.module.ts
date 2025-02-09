import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { SocialMessagesConsumer } from './consumers';


@Module({
  controllers: [
    SocialMessagesConsumer,
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [

  ],
})

export class SocialAppModule { }

