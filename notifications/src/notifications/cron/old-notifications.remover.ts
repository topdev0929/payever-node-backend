import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { NotificationService } from '../services';

const NOTIFICATIONS_LIFETIME_MONTH: number = 1;

@Injectable()
export class OldNotificationsRemover {
  constructor(
    private readonly logger: Logger,
    private readonly notificationsService: NotificationService,
  ) { }

  @Cron('0 0 * * *')
  public async removeOldNotifications(): Promise<void> {
    const dateToRemove: Date = new Date();
    dateToRemove.setMonth(dateToRemove.getMonth() - NOTIFICATIONS_LIFETIME_MONTH);
    this.logger.log(`Removing old notifications till "${dateToRemove.toISOString()}"`);
    await this.notificationsService.deleteTill(dateToRemove);
  }
}
