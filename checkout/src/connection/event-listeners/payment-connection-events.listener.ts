import { Injectable } from '@nestjs/common';
import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import { CheckoutModel } from '../../checkout/models';
import { IntegrationCategory, IntegrationEvent } from '../../integration/enums';
import { BusinessIntegrationSubModel, IntegrationModel } from '../../integration/models';
import { BusinessIntegrationSubscriptionService } from '../../integration/services';
import { ConnectionEvent } from '../enums';
import { ConnectionModel } from '../models';
import { CheckoutConnectionService, ConnectionService } from '../services';
import { CheckoutDbService } from '../../common/services';

@Injectable()
export class PaymentConnectionEventsListener {
  constructor(
    private checkoutDbService: CheckoutDbService,
    private connectionService: ConnectionService,
    private checkoutConnectionService: CheckoutConnectionService,
    private subscriptionService: BusinessIntegrationSubscriptionService,
    private dispatcher: EventDispatcher,
  ) { }

  @EventListener(ConnectionEvent.ConnectionCreated)
  public async installConnectionToCheckouts(
    business: BusinessModel,
    integration: IntegrationModel,
    connection: ConnectionModel,
  ): Promise<void> {
    if (integration.category !== IntegrationCategory.Payments) {
      return;
    }

    const tasks: Array<Promise<void>> = [];
    const checkouts: CheckoutModel[] = await this.checkoutDbService.findAllByBusiness(business);

    for (const checkout of checkouts) {
      tasks.push(this.checkoutConnectionService.install(connection, checkout));
    }
    await Promise.all(tasks);
  }

  @EventListener(ConnectionEvent.ConnectionRemoved)
  public async uninstallConnectionFromCheckouts(
    business: BusinessModel,
    integration: IntegrationModel,
    connection: ConnectionModel,
  ): Promise<void> {
    if (integration.category !== IntegrationCategory.Payments) {
      return;
    }

    const tasks: Array<Promise<void>> = [];
    const checkouts: CheckoutModel[] = await this.checkoutDbService.findAllByBusiness(business);
    for (const checkout of checkouts) {
      tasks.push(this.checkoutConnectionService.uninstall(connection, checkout));
    }
    await Promise.all(tasks);
  }

  @EventListener(ConnectionEvent.ConnectionRemoved)
  public async disableBusinessIntegrationSubscription(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<void> {
    if (integration.category !== IntegrationCategory.Payments) {
      return;
    }

    const connections: ConnectionModel[] =
      await this.connectionService.findAllByBusinessAndIntegration(business, integration);
    const active: ConnectionModel[] = connections.filter((c: ConnectionModel) => c.isBpoActive !== false);
    if (active.length > 0) {
      return;
    }

    const subscription: BusinessIntegrationSubModel =
      await this.subscriptionService.findOneByIntegrationAndBusiness(integration, business);
    await this.subscriptionService.disable(subscription);
    await this.dispatcher.dispatch(IntegrationEvent.IntegrationDisabled, business, integration);
  }
}
