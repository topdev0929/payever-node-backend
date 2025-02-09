import { Injectable } from '@nestjs/common';
import { ConnectionPlanModel } from '../models';
import { Subscriptions } from '../services';
import { EventListener } from '@pe/nest-kit';
import { PlanEventsEnum } from '../enums';

@Injectable()
export class PlanEventsListener {
  constructor(
    private readonly subscriptionsService: Subscriptions,
  ) { }

  @EventListener(PlanEventsEnum.PlanDeleted)
  public async onPlanDeleted(plan: ConnectionPlanModel): Promise<void> {
    await this.subscriptionsService.stopSubscriptionsByPlan(plan);
  }
}
