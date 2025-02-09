import { Module } from '@nestjs/common';
import { SocialModule } from '../social';
import { EventsGateway } from './events.gateway';
import { PostSubscriptionService, WsSubscriptionService } from './services';
import { PostStateListener } from './event-listeners';
@Module({
  controllers: [
  ],
  exports: [
  ],
  imports: [
    SocialModule,
  ],
  providers: [
    EventsGateway,
    PostSubscriptionService,
    WsSubscriptionService,
    PostStateListener,
  ],
})
export class WSModule { }
