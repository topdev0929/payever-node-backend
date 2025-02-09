import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { NotificationSchemaName } from '../schemas';
import { NotificationModel } from '../models';
import { NotificationMessageDto } from '../dto';
import * as _ from 'lodash';
import { NotificationService } from '../services';

@Injectable()
export class NotificationMessageSnakeCaseCommand {
  constructor(
    @InjectModel(NotificationSchemaName) private readonly notificationModel: Model<NotificationModel>,
    private readonly notificationService: NotificationService,
  ) { }

  @Command({
    command: 'payment-notifications:message:fix-snake-case',
    describe: 'Converts message payment details into snake case',
  })
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
  ): Promise<void> {
    const criteria: any = { };
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

    Logger.log(`Starting snake case fix`);
    Logger.log(`Criteria is ${JSON.stringify(criteria, null, 2)}.`);

    const total: number = await this.notificationModel.countDocuments(criteria);
    Logger.log(`Found ${total} records.`);

    const limit: number = 1000;
    let processed: number = 0;

    while (processed < total) {
      const notificationModels: NotificationModel[] = await this.getWithLimit(processed, limit, criteria);
      let fixed: number = 0;

      Logger.log(`Starting next ${notificationModels.length} notifications.`);

      for (const notificationModel of notificationModels) {
        const message: NotificationMessageDto = JSON.parse(notificationModel.message);
        const paymentDetails: object = message.data.payment.payment_details;
        message.data.payment.payment_details = _.mapKeys(paymentDetails, (v: any, k: string) => _.snakeCase(k));
        message.data.payment.payment_details_array = _.mapKeys(paymentDetails, (v: any, k: string) => _.snakeCase(k));

        await this.notificationService.updateNotificationMessage(notificationModel, message);

        fixed++;
      }

      processed += fixed;
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
