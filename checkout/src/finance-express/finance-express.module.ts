import { Module } from '@nestjs/common';
import { FinanceExpressPaymentController } from './controllers';
import { FlowModule } from '../flow/flow.module';
import { LegacyApiModule } from '../legacy-api/legacy-api.module';
import { FinanceExpressManager } from './services';
import { CommonModule } from '../common/common.module';
import { ChannelSetModule } from '../channel-set/channel-set.module';
import { BusinessModule } from '../business/business.module';
import { InvalidateInitCacheListener } from './event-listeners';

@Module({
  controllers: [
    FinanceExpressPaymentController,
  ],
  exports: [
  ],
  imports: [
    BusinessModule,
    ChannelSetModule,
    CommonModule,
    FlowModule,
    LegacyApiModule,
  ],
  providers: [
    FinanceExpressManager,
    InvalidateInitCacheListener,
  ],
})
export class FinanceExpressModule { }
