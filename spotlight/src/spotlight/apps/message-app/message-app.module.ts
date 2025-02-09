import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { ChatMessagesConsumer } from './consumers';

@Module({
  controllers: [
    ChatMessagesConsumer,
  ],
  exports: [
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [
  ],
})
export class MessageAppModule { }
