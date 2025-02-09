import { Module } from '@nestjs/common';
import { SignupsEventListener } from './signups-event.listener';
import { FollowupService } from './followup.service';
import { FollowupEmailEventProducer } from './followup-email-event.producer';
import { SignupsModule } from '../signups';
import { BaseCrmModule } from '../base-crm';

@Module({
  exports: [
    FollowupService,
  ],
  imports: [
    BaseCrmModule,
    SignupsModule,
  ],
  providers: [
    SignupsEventListener,
    FollowupService,
    FollowupEmailEventProducer,
  ],
})
export class FollowupModule {
}
