import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ErrorNotificationModel } from '../../src/error-notifications/models';
import { ErrorNotificationSchemaName } from '../../src/error-notifications/schemas';
import { ErrorNotificationTypesEnum } from '../../src/error-notifications/enums';

const BUSINESS_SETTINGS_ID: string = '6111e145-fb5e-4098-ae0c-ad51ea92fa64';

class ErrorNotificationsUpdateTestFixture extends BaseFixture {
  private readonly errorNotificationModel: Model<ErrorNotificationModel> = this.application.get(
    getModelToken(ErrorNotificationSchemaName),
  );

  public async apply(): Promise<void> {
    const errorNotifications: any[] = [
      {
        _id: '498309a9-e256-4ec1-9088-bdeabd107f33',
        businessId: BUSINESS_SETTINGS_ID,
        createdAt: new Date(),
        errorDate: '2021-01-01T11:00:00.000Z',
        errorDetails: { },
        integration: 'paypal',
        type: ErrorNotificationTypesEnum.lastTransactionTime,
        updatedAt: new Date(),
      },

    ];

    await this.errorNotificationModel.create(errorNotifications);
  }
}

export = ErrorNotificationsUpdateTestFixture;
