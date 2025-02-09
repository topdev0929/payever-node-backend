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
    const checkoutMetricsId: string = '65ceae0a-b810-41b9-907f-923b6f7892a1';
    const paymentFlowId: string = '815e412c-6881-11e7-9835-52540073a0b6';

    const checkoutMetrics: CheckoutMetricsModel =
      await this.checkoutMetricsModel.create(CheckoutMetricsFactory.create({
        _id: checkoutMetricsId,
        paymentFlowId: paymentFlowId,
        paymentMethod: 'santander_installment_no',
      }));

    await checkoutMetrics.save();
  }
}

export = TestFixture;
