import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { EventEnum } from '../enums';
import { SubscriptionMediaService } from '../services';

@Injectable()
export class SubscriptionMediaCompressTriggerListener {
  constructor(
    private readonly subscriptionMediaService: SubscriptionMediaService,
  ) { }

  @EventListener(EventEnum.SUBSCRIPTION_MEDIA_COMPRESS_TRIGGER)
  public async onCompressTrigger(): Promise<void> {
    await this.subscriptionMediaService.compressTrigger();
  }
}
