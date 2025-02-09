import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { TransactionMessagesConsumer } from './consumers';

@Module({
  controllers: [
    TransactionMessagesConsumer,
  ],
  exports: [
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [
  ],
})
export class TransactionsAppModule { }
