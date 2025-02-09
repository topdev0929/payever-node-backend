import { BaseFixture } from '@pe/cucumber-sdk';
import { integrationFactory, shippingMethodFactory, shippingOrderFactory } from '../../factories';
import { ShippingMethodModel } from '../../../../src/shipping/models';

const shippingMethodId: string = 'ad738281-f9f0-4db7-a4f6-670b0dff5327';
const integrationId: string = '36bf8981-8827-4c0c-a645-02d9fc6d72c8';
const shippingOrderId: string = '3263d46c-755d-4fe6-b02e-ede4d63748b4';
const transactionId: string = 'ad738281-f9f0-4db7-a4f6-670b0dff5327';

class CustomMethodSelectedFixture extends BaseFixture {
  public async apply(): Promise<void> {

    await this.connection.collection('integrations').insertOne(integrationFactory({
      _id: integrationId,
      name: 'custom',
    }));

    const shippingMethod: ShippingMethodModel = shippingMethodFactory({
      _id: shippingMethodId,
      integration: integrationId,
    });
    await this.connection.collection('shippingmethods').insertOne(shippingMethod);

    await this.connection.collection('shippingorders').insertOne(shippingOrderFactory(
      {
        _id: shippingOrderId,
        shippingMethod: shippingMethod,
        transactionId: transactionId,
      },
    ));
  }
}

export = CustomMethodSelectedFixture;
