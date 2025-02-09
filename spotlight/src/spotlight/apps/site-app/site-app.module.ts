import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { SiteMessagesConsumer } from './consumers';


@Module({
  controllers: [
    SiteMessagesConsumer,
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [

  ],
})

export class SiteAppModule { }

