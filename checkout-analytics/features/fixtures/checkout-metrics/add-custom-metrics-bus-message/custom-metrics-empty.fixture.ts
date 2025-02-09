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

    const checkoutMetrics: CheckoutMetricsModel =
      await this.checkoutMetricsModel.create(CheckoutMetricsFactory.create({
        _id: checkoutMetricsId,
        paymentMethod: 'santander_installment',
      }));

    await checkoutMetrics.save();
  }
}

export = TestFixture;
