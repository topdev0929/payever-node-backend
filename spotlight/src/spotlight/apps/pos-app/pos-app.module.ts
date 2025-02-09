import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { PosMessagesConsumer } from './consumers';

@Module({
  controllers: [
    PosMessagesConsumer,
  ],
  exports: [
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [
  ],
})
export class PosAppModule { }
