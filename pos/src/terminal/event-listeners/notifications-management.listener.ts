import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { TerminalModel } from '../models';
import { TerminalEvent } from './terminal-events.enum';
import { PosNotifier } from '../notifiers';
import { BusinessModel } from '../../business/models';

@Injectable()
export class NotificationsManagementListener {
  constructor(
    private readonly notifier: PosNotifier,
  ) { }

  @EventListener(TerminalEvent.TerminalCreated)
  public async onTerminalCreated(pos: TerminalModel): Promise<void> {
    await pos.populate('business').execPopulate();
    const business: BusinessModel = pos.business;

    const messages: Array<Promise<void>> = [
      this.notifier.sendAddThemeNotification(pos, business),
      this.notifier.sendChooseProductsNotification(pos, business),
      this.notifier.sendSelectBillingNotification(pos, business),
      this.notifier.sendTakeTourNotification(pos, business),
    ];

    if (!pos.logo) {
      messages.push(this.notifier.sendAddLogoNotification(pos, business));
    }

    await Promise.all(messages);
  }

  @EventListener(TerminalEvent.TerminalUpdated)
  public async onTerminalUpdated(originalPos: TerminalModel, updatedPos: TerminalModel): Promise<void> {
    await updatedPos.populate('business').execPopulate();

    if (updatedPos.logo && !originalPos.logo) {
      await this.notifier.cancelAddLogoNotification(updatedPos, updatedPos.business);
    }
  }
}
