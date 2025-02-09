import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { NotificationSchemaName } from '../schemas';
import { NotificationModel } from '../models';
import { NotificationSender } from '../services';

@Injectable()
export class ResendNotificationsCommand {
  constructor(
    @InjectModel(NotificationSchemaName) private readonly notificationModel: Model<NotificationModel>,
    private readonly notificationSender: NotificationSender,
  ) { }

  @Command({ command: 'payment-notifications:notification:resend', describe: 'Resend payment notifications' })
  public async export(
    @Option({
      name: 'business_id',
    }) businessId?: string,
    @Option({
      name: 'after',
    }) after?: string,
    @Option({
      name: 'before',
    }) before?: string,
    @Option({
      name: 'notification_id',
    }) notificationId?: string,
  ): Promise<void> {
    const criteria: any = { };
    if (notificationId) {
      criteria._id = notificationId;
    }
    if (businessId) {
      criteria.businessId = businessId;
    }
    if (before || after) {
      criteria.createdAt = { };
    }
    if (before) {
      criteria.createdAt.$lte = new Date(before);
    }
    if (after) {
      criteria.createdAt.$gte = new Date(after);
    }

    Logger.log(`Starting notifications resend`);
    Logger.log(`Criteria is ${JSON.stringify(criteria, null, 2)}.`);

    const total: number = await this.notificationModel.countDocuments(criteria);
    Logger.log(`Found ${total} records.`);

    const limit: number = 1000;
    let processed: number = 0;

    while (processed < total) {
      const notificationsModels: NotificationModel[] = await this.getWithLimit(processed, limit, criteria);
      let sent: number = 0;

      Logger.log(`Starting next ${notificationsModels.length} notifications.`);

      for (const notificationModel of notificationsModels) {
        await this.notificationSender.sendPaymentNotification(notificationModel);
        sent++;
      }

      processed += sent;
      Logger.log(`Processed ${processed} of ${total}.`);
    }
  }

  private async getWithLimit(start: number, limit: number, criteria: any): Promise<NotificationModel[]> {
    return this.notificationModel.find(
      criteria,
      null,
      {
        limit: limit,
        skip: start,
        sort: { deliveryAt: 1 },
      },
    );
  }
}
