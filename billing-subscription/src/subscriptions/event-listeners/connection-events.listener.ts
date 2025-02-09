import { Injectable } from '@nestjs/common';
import { SubscriptionPlanService } from '../services';
import { EventListener } from '@pe/nest-kit';
import { ConnectionEventsEnum } from '../../integrations/enums';
import { ConnectionModel } from '../../integrations/models';

@Injectable()
export class ConnectionEventsListener {
  constructor(
    private readonly subscriptionPlansService: SubscriptionPlanService,
  ) { }

  @EventListener(ConnectionEventsEnum.ConnectionRemoved)
  public async onConnectionRemoved(connection: ConnectionModel): Promise<void> {
    await this.subscriptionPlansService.stopSubscriptionsAndRemovePlansAndSubscriptionPlanForConnection(connection);
  }

  @EventListener(ConnectionEventsEnum.ConnectionEnabled)
  public async onConnectionEnabled(connection: ConnectionModel): Promise<void> {
    await this.subscriptionPlansService.createPlansAndSubscriptionPlanForAllProductsByConnection(connection);
  }

  @EventListener(ConnectionEventsEnum.ConnectionDisabled)
  public async onConnectionDisabled(connection: ConnectionModel): Promise<void> {
    await this.subscriptionPlansService.stopSubscriptionsAndRemovePlansAndSubscriptionPlanForConnection(connection);
  }
}
