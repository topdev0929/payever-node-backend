import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { NotificationModel } from '../../../../src/payment-notifications/models';
import { NotificationSchemaName } from '../../../../src/payment-notifications/schemas';
import { NotificationFactory } from '../../../fixture-factories/notification.factory';
import { PaymentNotificationStatusesEnum } from '../../../../src/payment-notifications/enums';

class TestFixture extends BaseFixture {
  private notificationModel: Model<NotificationModel> =
    this.application.get(getModelToken(NotificationSchemaName));

  public async apply(): Promise<void> {
    const notificationId: string = 'b948082c-246e-46a4-a87a-41a4241ad24c';

    const notification: NotificationModel = await this.notificationModel
      .create(NotificationFactory.create({
        _id: notificationId,
        deliveryAttempts: [],
        retriesNumber: 1,
        status: PaymentNotificationStatusesEnum.STATUS_PROCESSING,
      }) as any);
  }
}

export = TestFixture;
