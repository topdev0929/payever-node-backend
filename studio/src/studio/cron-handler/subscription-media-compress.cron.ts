import { Injectable } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { environment } from '../../environments';
import { SubscriptionMediaService } from '../services';

@Injectable()
export class SubscriptionMediaCompressCron {

  constructor(
    private readonly subscriptionMediaService: SubscriptionMediaService,
  ) {
  }

  @Cron(environment.cronTimer.every5minutes)
  private async subscriptionMediaCompress(): Promise<void> {
    await this.subscriptionMediaService.compressTrigger();
  }
}
