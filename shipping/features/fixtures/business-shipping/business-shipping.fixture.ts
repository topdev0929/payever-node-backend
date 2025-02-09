import { BaseFixture } from "@pe/cucumber-sdk";
import { integrationFactory, businessFactory, shippingMethodFactory } from "../factories";
import { ShippingMethodModel } from "../../../src/shipping/models";

const businessId: string = '568192aa-36ea-48d8-bc0a-8660029e6f72';
const channelSetId: string = '0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8c3';
const integrationId: string = '36bf8981-8827-4c0c-a645-02d9fc6d72c8';
const settingId: string = 'f59850e6-a027-4338-b9ba-979e07037023';
const originId: string = '0acf9a70-db1d-4af9-8be3-4d97d671cf14';
const boxId: string = 'f561829c-a9a2-4eb8-b3fe-9d18a7c4a622';
const shippingMethodId: string = 'ad738281-f9f0-4db7-a4f6-670b0dff5327';
const integrationSubscriptionId: string = 'e87ea7d6-de6b-4d73-8226-83c41da3e600';
const ruleId: string = 'a17913e9-e737-4839-880f-a3ae4df9b081';

class BusinessShippingFixture extends BaseFixture {
  public async apply(): Promise<void> {

    await this.connection.collection('integrations').insertOne(integrationFactory({
      _id: integrationId,
      name: 'custom',
    }));

    await this.connection.collection('shippingorigins').insertOne({
      _id: originId,
      isDefault: true,
      streetName: `Street name`,
      streetNumber: '111',
      city: `city`,
      zipCode: '11111',
      countryCode: `CO`,
    });

    await this.connection.collection('shippingboxes').insertOne({
      _id: boxId,
      dimensionUnit: 'cm',
      weightUnit: 'kg',
      isDefault: true,
    });

    await this.connection.collection('shippingsettings').insertOne({
      _id: settingId,
      businessId: businessId,
      origins: [originId],
      boxes: [boxId],
    });

    await this.connection.collection('integrationrules').insertOne({
      _id: ruleId,
      isActive: true,
    });

    await this.connection.collection('integrationsubscriptions').insertOne({
      _id: integrationSubscriptionId,
      integration: integrationId,
      enabled: true,
      installed: true,
      rules: [ruleId],
    });

    await this.connection.collection('businesses').insertOne(businessFactory({
      _id: businessId,
      integrationSubscriptions: [integrationSubscriptionId],
      settings: [settingId],
    }));

    await this.connection.collection('channelsets').insertOne({
      _id: channelSetId,
      businessId: businessId,
    });

    const shippingMethod: ShippingMethodModel = shippingMethodFactory({
      _id: shippingMethodId,
      businessId: businessId,
      integration: integrationId,
    });
    await this.connection.collection('shippingmethods').insertOne(shippingMethod);
  }
}

export = BusinessShippingFixture;
