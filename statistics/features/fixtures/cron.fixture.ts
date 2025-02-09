import { v4 as uuid } from 'uuid';

import { Collection } from 'mongodb';
import { Model } from 'mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';

import { PaymentModel } from '../../src/etl/models';
import { PaymentSchemaName } from '../../src/etl/schemas';
import { paymentFactory } from './factories/payment.factory';
import { metricFactory } from './factories/metric.factory';
import { BusinessModel, BusinessSchemaName } from '../../src/statistics';
import { businessFactory } from './factories';

const BUSINESS_ID: string = '568192aa-36ea-48d8-bc0a-8660029e6f72';

const paymentIds: string[] = [
  '8fd31f6c-fdd6-4504-9039-1935a071bec2',
  'f42fa1e8-1b99-4819-9f68-c62e0542d7a5',
  '2b0f8952-49f1-428b-bd84-ecdfff58b8c3',
  'd1a6170a-4c41-4f7f-af29-368fb35b3ecf',
  '1c852cac-cb5b-4bfd-acab-0c397ca64207',
  ...(new Array(100)).fill(0).map(() => uuid()),
];

const existedIds: string[] = [
  '8fd31f6c-fdd6-4504-9039-1935a071bec2',
  'f42fa1e8-1b99-4819-9f68-c62e0542d7a5',
];

class CronFixture extends BaseFixture {
  protected readonly businessModel: Model<BusinessModel> =
    this.application.get(getModelToken(BusinessSchemaName));
  protected readonly paymentModel: Model<PaymentModel> =
    this.application.get(getModelToken(PaymentSchemaName));
  protected readonly sourcePaymentModel: Collection =
    this.connection.useDb('checkout-analytics').collection('payments');
  protected readonly sourceMetricsModel: Collection =
    this.connection.useDb('checkout-analytics').collection('checkoutmetrics');
  public async apply(): Promise<void> {
    await this.businessModel.insertMany([
      businessFactory({
        _id: BUSINESS_ID,
        createdAt: (new Date()) as any as string,
      }),
    ]);

    await this.paymentModel.insertMany(
      existedIds.map((_id: string) => paymentFactory({
        _id,
        businessId: BUSINESS_ID,
        channel: 'invalid value',
      })),
    );

    await this.sourcePaymentModel.insertMany(
      paymentIds.map((_id: string) => paymentFactory({
        _id,
        businessId: BUSINESS_ID,
      })),
    );

    await this.sourceMetricsModel.insertMany(
      paymentIds.map((_id: string) => metricFactory({ newPaymentId: _id })),
    );
  }
}

export = CronFixture;
