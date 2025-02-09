import { HttpModule, Module } from '@nestjs/common';
import { BusinessModule } from '../business/business.module';
import { ChannelSetModule } from '../channel-set/channel-set.module';
import { IntegrationModule } from '../integration/integration.module';
import { BusMessageController } from './controller';
import { BusMessageProducer } from './producer';
import { CheckoutPaymentService } from './services';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [
    BusMessageController,
  ],
  exports: [
  ],
  imports: [
    HttpModule,
    BusinessModule,
    CommonModule,
    ChannelSetModule,
    IntegrationModule,
  ],
  providers: [
    CheckoutPaymentService,
    BusMessageProducer,
  ],
})
export class MailReportModule { }
