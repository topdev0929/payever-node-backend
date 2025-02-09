import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { InvoiceMessagesConsumer } from './consumers';

@Module({
  controllers: [
    InvoiceMessagesConsumer,
  ],
  exports: [
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [
  ],
})
export class InvoiceAppModule { }
