import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ErrorNotificationModel } from '../../src/error-notifications/models';
import { ErrorNotificationSchemaName } from '../../src/error-notifications/schemas';
import { ErrorNotificationTypesEnum } from '../../src/error-notifications/enums';
import * as dateFns from 'date-fns';

const EN_ID_STORED_JUST_NOW: string = '97356abe-5bf8-11eb-ae93-0242ac130002';

class ErrorNotificationsFixture extends BaseFixture {
  private readonly errorNotificationModel: Model<ErrorNotificationModel> = this.application.get(
    getModelToken(ErrorNotificationSchemaName),
  );

  public async apply(): Promise<void> {
    const errorNotifications: any[] = [
      {
        _id: '1c4eab24-60a0-11eb-ae93-0242ac130002',
        businessId: EN_ID_STORED_JUST_NOW,
        createdAt: dateFns.addMinutes(new Date(), -9),
        errorDate: dateFns.addMinutes(new Date(), -9),
        errorDetails: {
          integration: 'paypal',
          message: 'not authorized',
          statusCode: 404,
        },
        type: ErrorNotificationTypesEnum.pspApiFailed,
        updatedAt: dateFns.addMinutes(new Date(), -9),
      },
      {
        _id: '18c12d6a-60a0-11eb-ae93-0242ac130002',
        businessId: EN_ID_STORED_JUST_NOW,
        createdAt: new Date(),
        errorDetails: {
          clientId: '98fb0520-e487-45ef-8fd3-c2b1313a55b2',
          clientSecret: '0378ede71a1b5e8843572a5932806707a41484d62006473c',
          name: 'api name',
        },
        type: ErrorNotificationTypesEnum.apiKeysInvalid,
        updatedAt: new Date(),
      },
      {
        _id: '3ee6a81e-ecaf-4af3-8f6b-cb26926cdce9',
        businessId: EN_ID_STORED_JUST_NOW,
        createdAt: new Date(),
        emailSent: true,
        errorDate: dateFns.addMinutes(new Date(), -75),
        errorDetails: { },
        integration: 'stripe',
        lastTimeSent: dateFns.addMinutes(new Date(), -15),
        type: ErrorNotificationTypesEnum.lastTransactionTime,
        updatedAt: new Date(),
      },
    ];

    await this.errorNotificationModel.create(errorNotifications);
  }
}

export = ErrorNotificationsFixture;
