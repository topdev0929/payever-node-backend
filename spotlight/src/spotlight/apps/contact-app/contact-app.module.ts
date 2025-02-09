import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { ContactMessagesConsumer } from './consumers';


@Module({
  controllers: [
    ContactMessagesConsumer,
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [

  ],
})

export class ContactAppModule { }

