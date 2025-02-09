import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { ConnectMessagesConsumer } from './consumers';


@Module({
  controllers: [
    ConnectMessagesConsumer,
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [

  ],
})

export class ConnectAppModule { }

