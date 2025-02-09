import { Module } from '@nestjs/common';
import { IntegrationModule } from '@pe/synchronizer-kit';

import { ConnectEventsConsumer } from './consumers';
import { SynchronizerModule } from '../synchronizer';

@Module({
  controllers: [
    ConnectEventsConsumer,
  ],
  imports: [
    SynchronizerModule,
    IntegrationModule,
  ],
})
export class ThirdPartyModule { }
