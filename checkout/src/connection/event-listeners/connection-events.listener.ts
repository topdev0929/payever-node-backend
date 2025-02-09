import { Injectable } from '@nestjs/common';
import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import { IntegrationEvent } from '../../integration/enums';
import { BusinessIntegrationSubModel, IntegrationModel } from '../../integration/models';
import { BusinessIntegrationSubscriptionService } from '../../integration/services';
import { ConnectionEvent } from '../enums';
import { ConnectionModel } from '../models';
import { ConnectionService } from '../services';

@Injectable()
export class ConnectionEventsListener {
  constructor(
    private connectionService: ConnectionService,
    private subscriptionService: BusinessIntegrationSubscriptionService,
    private dispatcher: EventDispatcher,
  ) { }

  /**
   * For any created connection business subscription should be enabled.
   */
  @EventListener(ConnectionEvent.ConnectionCreated)
  public async connectionCreated(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<void> {
    const subscription: BusinessIntegrationSubModel =
      await this.subscriptionService.findOneByIntegrationAndBusiness(integration, business);
    await this.subscriptionService.enable(subscription);
    await this.dispatcher.dispatch(IntegrationEvent.IntegrationEnabled, business, integration);
  }

  /**
   * If there are no other connections after each removing, then business subscription should be disabled.
   */
  @EventListener(ConnectionEvent.ConnectionRemoved)
  public async connectionRemoved(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<void> {
    const connections: ConnectionModel[] =
      await this.connectionService.findAllByBusinessAndIntegration(business, integration);
    if (connections.length > 0) {
      return;
    }

    const subscription: BusinessIntegrationSubModel =
      await this.subscriptionService.findOneByIntegrationAndBusiness(integration, business);
    await this.subscriptionService.disable(subscription);
    await this.dispatcher.dispatch(IntegrationEvent.IntegrationDisabled, business, integration);
  }
}
