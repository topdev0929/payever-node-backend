import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { AppointmentMessagesConsumer } from './consumers';

@Module({
  controllers: [
    AppointmentMessagesConsumer,
  ],
  exports: [
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [
  ],
})
export class AppointmentAppModule { }
