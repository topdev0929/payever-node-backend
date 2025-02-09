import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ErrorNotificationModel } from '../../src/error-notifications/models';
import { ErrorNotificationSchemaName } from '../../src/error-notifications/schemas';
import { ErrorNotificationTypesEnum } from '../../src/error-notifications/enums';
import * as dateFns from 'date-fns';

const EN_ID_STORED_3_HOURS_AGO: string = '9ed558b5-a1dd-4bad-b774-08aa13c4ea69';
const EN_ID_STORED_5_HOURS_AGO: string = '2f29424e-5b1f-11eb-ae93-0242ac130002';
const EN_ID_STORED_30_MIN_AGO: string = '7a085ee5-1498-4399-9e61-618445c3b213';
const EN_ID_STORED_10_MIN_AGO: string = '87551f22-5bf8-11eb-ae93-0242ac130002';
const EN_ID_STORED_JUST_NOW: string = '97356abe-5bf8-11eb-ae93-0242ac130002';
const EN_ID_STORED_LAST_TR_TIME: string = 'bcee5dad-6cc4-4cf7-a9dc-57d3a5b2bba0';

class ErrorNotificationsFixture extends BaseFixture {
  private readonly errorNotificationModel: Model<ErrorNotificationModel> = this.application.get(
    getModelToken(ErrorNotificationSchemaName),
  );

  public async apply(): Promise<void> {
    const errorNotifications: any[] = [
      {
        _id: '27af787c-60a0-11eb-ae93-0242ac130002',
        businessId: EN_ID_STORED_3_HOURS_AGO,
        createdAt: dateFns.addHours(new Date(), -3),
        errorDate: new Date(Date.UTC(2021, 5, 22, 15, 6, 15)),
        errorDetails: {
          deliveryAttempts: 2,
          firstFailure: new Date(Date.UTC(2021, 5, 22, 15, 6, 15)),
          noticeUrl: 'notice url 1',
          paymentId: '2d4bcbce-5bf9-11eb-ae93-0242ac130002',
          statusCode: 500,
        },
        integration: 'cash',
        type: ErrorNotificationTypesEnum.paymentNotificationFailed,
        updatedAt: dateFns.addHours(new Date(), -3),
      },
      {
        _id: '23c81610-60a0-11eb-ae93-0242ac130002',
        businessId: EN_ID_STORED_5_HOURS_AGO,
        createdAt: dateFns.addHours(new Date(), -5),
        errorDate: dateFns.addHours(new Date(), -5),
        errorDetails: {
          credentials: {
            credentialsData: 'credentials data',
          },
          message: 'not authorized',
          statusCode: 404,
        },
        integration: 'cash',
        type: ErrorNotificationTypesEnum.paymentOptionCredentialsInvalid,
        updatedAt: dateFns.addHours(new Date(), -5),
      },
      {
        _id: '20023358-60a0-11eb-ae93-0242ac130002',
        businessId: EN_ID_STORED_30_MIN_AGO,
        createdAt: dateFns.addMinutes(new Date(), -30),
        errorDate: new Date(Date.UTC(2021, 5, 22, 15, 6, 15)),
        errorDetails: {
          deliveryAttempts: 2,
          firstFailure: new Date(Date.UTC(2021, 5, 22, 15, 6, 15)),
          noticeUrl: 'notice url 3',
          paymentId: '7505b6b0-5bf8-11eb-ae93-0242ac130002',
          statusCode: 500,
        },
        integration: 'paypal',
        type: ErrorNotificationTypesEnum.paymentNotificationFailed,
        updatedAt: dateFns.addMinutes(new Date(), -30),
      },
      {
        _id: '1c4eab24-60a0-11eb-ae93-0242ac130002',
        businessId: EN_ID_STORED_10_MIN_AGO,
        createdAt: dateFns.addMinutes(new Date(), -10),
        errorDate: dateFns.addMinutes(new Date(), -10),
        errorDetails: {
          integration: 'paypal',
          message: 'not authorized',
          statusCode: 404,
        },
        type: ErrorNotificationTypesEnum.pspApiFailed,
        updatedAt: dateFns.addMinutes(new Date(), -10),
      },
      {
        _id: '18c12d6a-60a0-11eb-ae93-0242ac130002',
        businessId: EN_ID_STORED_JUST_NOW,
        createdAt: new Date(),
        errorDate: new Date(),
        errorDetails: {
          clientId: '98fb0520-e487-45ef-8fd3-c2b1313a55b2',
          clientSecret: '0378ede71a1b5e8843572a5932806707a41484d62006473c',
          name: 'api name',
        },
        type: ErrorNotificationTypesEnum.apiKeysInvalid,
        updatedAt: new Date(),
      },
      {
        _id: '498309a9-e256-4ec1-9088-bdeabd107f33',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        createdAt: new Date(),
        errorDate: dateFns.addMinutes(new Date(), -3),
        errorDetails: { },
        integration: 'paypal',
        type: ErrorNotificationTypesEnum.lastTransactionTime,
        updatedAt: new Date(),
      },
      {
        _id: '6a0b491c-60a0-11eb-ae93-0242ac130002',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        createdAt: new Date(),
        errorDate: dateFns.addMinutes(new Date(), -179),
        errorDetails: { },
        integration: 'santander_installment_dk',
        type: ErrorNotificationTypesEnum.lastTransactionTime,
        updatedAt: new Date(),
      },
      {
        _id: '6640c6a4-60a0-11eb-ae93-0242ac130002',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        createdAt: new Date(),
        errorDate: dateFns.addDays(new Date(), -3),
        errorDetails: { },
        integration: 'santander_installment',
        type: ErrorNotificationTypesEnum.lastTransactionTime,
        updatedAt: new Date(),
      },
      {
        _id: '58c333b0-7115-11eb-9439-0242ac130002',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        createdAt: new Date(),
        emailSent: true,
        errorDate: dateFns.addDays(new Date(), -3),
        errorDetails: { },
        integration: 'santander_installment_se',
        lastTimeSent: dateFns.addHours(new Date(), -2),
        type: ErrorNotificationTypesEnum.lastTransactionTime,
        updatedAt: new Date(),
      },
      {
        _id: '2b47ec2c-7116-11eb-9439-0242ac130002',
        businessId: EN_ID_STORED_LAST_TR_TIME,
        createdAt: new Date(),
        emailSent: true,
        errorDate: dateFns.addDays(new Date(), -4),
        errorDetails: { },
        integration: 'santander_installment_nl',
        lastTimeSent: dateFns.addMinutes(new Date(), -5),
        type: ErrorNotificationTypesEnum.lastTransactionTime,
        updatedAt: new Date(),
      },
    ];

    await this.errorNotificationModel.create(errorNotifications);
  }
}

export = ErrorNotificationsFixture;
