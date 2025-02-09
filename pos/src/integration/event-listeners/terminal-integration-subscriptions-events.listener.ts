import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { TerminalEvent } from '../../terminal/event-listeners';
import { TerminalModel } from '../../terminal/models';
import { TerminalIntegrationSubscriptionService } from '../services';
import { BusinessService, BusinessModel } from '@pe/business-kit';

@Injectable()
export class TerminalIntegrationSubscriptionsEventsListener {
  constructor(
    private readonly terminalIntegrationSubscriptionService: TerminalIntegrationSubscriptionService,
    private readonly businessService: BusinessService,
  ) { }

  @EventListener(TerminalEvent.TerminalRemoved)
  public async onTerminalRemoved(terminal: TerminalModel): Promise<void> {
    await this.terminalIntegrationSubscriptionService.deleteAllByTerminal(terminal);
  }

  @EventListener(TerminalEvent.TerminalCreated)
  public async onTerminalCreated(terminal: TerminalModel): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(terminal.businessId);
    await this.terminalIntegrationSubscriptionService.processPendingInstallment(business, terminal);
  }
}
