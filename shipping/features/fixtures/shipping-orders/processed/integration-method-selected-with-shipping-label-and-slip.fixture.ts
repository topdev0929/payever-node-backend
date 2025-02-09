import { BaseFixture } from '@pe/cucumber-sdk';
import { integrationFactory, shippingMethodFactory, shippingOrderFactory, businessFactory } from '../../factories';
import { ShippingMethodModel } from '../../../../src/shipping/models';
import { ShippingStatusEnums } from '../../../../src/shipping/enums';

const shippingMethodId: string = 'ad738281-f9f0-4db7-a4f6-670b0dff5327';
const integrationId: string = '36bf8981-8827-4c0c-a645-02d9fc6d72c8';
const shippingOrderId: string = '3263d46c-755d-4fe6-b02e-ede4d63748b4';
const transactionId: string = 'ad738281-f9f0-4db7-a4f6-670b0dff5327';
const businessId: string = '531a43cc-e191-46a4-9d42-fd6a9cc59fb9';

class IntegrationMethodSelectedWithShippingLabelFixture extends BaseFixture {
  public async apply(): Promise<void> {

    await this.connection.collection('integrations').insertOne(integrationFactory({
      _id: integrationId,
      name: 'some-integration-name',
    }));

    const shippingMethod: ShippingMethodModel = shippingMethodFactory({
      _id: shippingMethodId,
      businessId: businessId,
      integration: integrationId,
    });
    await this.connection.collection('shippingmethods').insertOne(shippingMethod);

    await this.connection.collection('shippingorders').insertOne(shippingOrderFactory({
      _id: shippingOrderId,
      status: ShippingStatusEnums.Processed,
      shippingMethod,
      transactionId,
      businessId: businessId,
      trackingId: "adhakjfhdskf",
    }));
  }
}

export = IntegrationMethodSelectedWithShippingLabelFixture;
