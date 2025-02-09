import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { UpdateWriteOpResult } from 'mongoose';
import { NotificationService } from '../services';

@Injectable()
export class RenewProcessingNotificationsCommand {
  constructor(
    private readonly notificationService: NotificationService,
  ) { }

  @Command({
    command: 'payment-notifications:processing-notifications:renew',
    describe: 'Renew processing payment notifications',
  })
  public async export(
  ): Promise<void> {
    Logger.log(`Starting notifications renew`);
    const result: UpdateWriteOpResult = await this.notificationService.renewAllProcessingNotifications();
    Logger.log(`Updated ${result.nModified} records.`);
  }
}
