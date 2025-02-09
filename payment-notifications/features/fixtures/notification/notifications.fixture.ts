import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { NotificationModel } from '../../../src/payment-notifications/models';
import { NotificationSchemaName } from '../../../src/payment-notifications/schemas';
import { NotificationFactory } from '../../fixture-factories/notification.factory';
import { PaymentNotificationStatusesEnum } from '../../../src/payment-notifications/enums';
import { v4 as uuid } from 'uuid';
class TestFixture extends BaseFixture {
  private notificationModel: Model<NotificationModel> =
    this.application.get(getModelToken(NotificationSchemaName));

  public async apply(): Promise<void> {
    for (let index = 0; index < 10; index++) {
      await this.notificationModel
        .create(NotificationFactory.create({
          _id: uuid(),
          deliveryAttempts: [],
          businessId:'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
          paymentId:'pppppppp-pppp-pppp-pppp-pppppppppppp',
          retriesNumber: 1,
          status: index % 2 == 0 ?
            PaymentNotificationStatusesEnum.STATUS_SUCCESS :
            PaymentNotificationStatusesEnum.STATUS_FAILED,
        }) as any);
    }

  }
}

export = TestFixture;
