import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { CheckoutMetricsModel } from '../../../../src/checkout-analytics/models';
import { CheckoutMetricsSchemaName } from '../../../../src/checkout-analytics/schemas';
import { CheckoutMetricsFactory } from '../../../fixture-factories/checkout-metrics.factory';

class TestFixture extends BaseFixture {
  private checkoutMetricsModel: Model<CheckoutMetricsModel> =
    this.application.get(getModelToken(CheckoutMetricsSchemaName));

  public async apply(): Promise<void> {
    const checkoutMetricsId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    const paymentFlowId: string = '08b1d4a82ca1c65aa35ad4c85f2ac8a8';
    const apiCallId: string = '7e3dcb4bf94bf23f6d4113e5845fe9f8';

    const checkoutMetrics: CheckoutMetricsModel =
      await this.checkoutMetricsModel.create(CheckoutMetricsFactory.create({
        _id: checkoutMetricsId,
        apiCallId: apiCallId,
        paymentFlowId: paymentFlowId,
        paymentMethod: null,
      }));

    await checkoutMetrics.save();
  }
}

export = TestFixture;
