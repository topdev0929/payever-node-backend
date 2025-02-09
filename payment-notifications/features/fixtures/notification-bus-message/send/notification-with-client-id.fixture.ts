import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ApiCallModel, NotificationModel } from '../../../../src/payment-notifications/models';
import { ApiCallSchemaName, NotificationSchemaName } from '../../../../src/payment-notifications/schemas';
import { NotificationFactory } from '../../../fixture-factories/notification.factory';
import { ApiCallFactory } from '../../../fixture-factories/api-call.factory';
import { PaymentNotificationStatusesEnum } from '../../../../src/payment-notifications/enums';

class TestFixture extends BaseFixture {
  private notificationModel: Model<NotificationModel> =
    this.application.get(getModelToken(NotificationSchemaName));
  private apiCallModel: Model<ApiCallModel> =
    this.application.get(getModelToken(ApiCallSchemaName));

  public async apply(): Promise<void> {
    const notificationId: string = 'b948082c-246e-46a4-a87a-41a4241ad24c';
    const apiCallId: string = '65680f95-e104-4687-a437-b26e93d2ef82';

    const apiCall: ApiCallModel = await this.apiCallModel
      .create(ApiCallFactory.create({
        _id: apiCallId,
        businessId: 'business-id',
        clientId: 'client-id',
      }));

    const notification: NotificationModel = await this.notificationModel
      .create(NotificationFactory.create({
        _id: notificationId,
        apiCallId: apiCallId,
        status: PaymentNotificationStatusesEnum.STATUS_PROCESSING,
      }) as any);
  }
}

export = TestFixture;
