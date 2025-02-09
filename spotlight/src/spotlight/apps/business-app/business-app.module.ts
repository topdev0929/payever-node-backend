import { Module, forwardRef } from '@nestjs/common';
import { SpotlightModule } from '../../spotlight.module';
import { BusinessEventsListener } from './event-listeners';

@Module({
  controllers: [
  ],
  imports: [
    forwardRef(() => SpotlightModule),
  ],
  providers: [
    BusinessEventsListener,
  ],
})

export class BusinessAppModule { }

