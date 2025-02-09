import * as uuid from 'uuid';

import { BaseFixture } from '@pe/cucumber-sdk';
import { integrationFactory, shippingOrderFactory, businessFactory, shippingMethodFactory } from '../factories';
import { ShippingMethodModel } from '../../../src/shipping/models';

const businessId: string = '568192aa-36ea-48d8-bc0a-8660029e6f72';
const fakeBusinessId: string = '568192aa-36ea-48d8-bc0a-8660029e6f71';
const businessWithNoDefaultOrigin: string = '568192aa-36ea-48d8-bc0a-8660029e6f73';
const businessWithCustomIntegration: string = '568192aa-36ea-48d8-bc0a-8660029e6f7o';
const businessWithCustomIntegrationWithoutRules: string = '568192aa-36ea-48d8-bc0a-8660029e6f7z';
const businessWithoutZones: string = '568192aa-36ea-48d8-bc0a-8660029e6f7m';
const channelSetId: string = '0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8c3';
const channelSetWithFakeBusinessId: string = '0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8c1';
const channelSetWithNoDefaultOrigin: string = '0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8cw';
const channelSetWithCustomIntegration: string = '0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8cl';
const channelSetWithCustomIntegrationWithoutRules: string = '0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8cz';
const channelSetWithoutZones: string = '0cec9b42-a2c8-4a6d-b0ce-ceb7c7c0e8cm';
const integrationId: string = '36bf8981-8827-4c0c-a645-02d9fc6d72c8';
const customIntegrationId: string = '36bf8981-8827-4c0c-a645-02d9fc6d72c1';
const customIntegrationWithoutRulesId: string = '36bf8981-8827-4c0c-a645-02d9fc6d72cz';
const settingId: string = 'f59850e6-a027-4338-b9ba-979e07037023';
const settingIdWithNoDefaultOrigin: string = 'f59850e6-a027-4338-b9ba-979e07037021';
const settingIdWithCustomIntegration: string = 'f59850e6-a027-4338-b9ba-979e0703702l';
const settingIdWithCustomIntegrationWithoutRules: string = 'f59850e6-a027-4338-b9ba-979e0703702z';
const settingWithoutZones: string = 'f59850e6-a027-4338-b9ba-979e0703702m';
const originId: string = '0acf9a70-db1d-4af9-8be3-4d97d671cf14';
const noDefaultOriginId: string = '0acf9a70-db1d-4af9-8be3-4d97d671cf11';
const zoneId: string = 'f561829c-a9a2-4eb8-b3fe-9d18a7c4a622';
const boxId: string = 'f561829c-a9a2-4eb8-b3fe-9d18a7c4a622';
const shippingMethodId: string = 'ad738281-f9f0-4db7-a4f6-670b0dff5327';
const integrationSubscriptionId: string = 'e87ea7d6-de6b-4d73-8226-83c41da3e600';
const customIntegrationSubscriptionId: string = 'e87ea7d6-de6b-4d73-8226-83c41da3e601';
const customIntegrationSubscriptionWithoutRulesId: string = 'e87ea7d6-de6b-4d73-8226-83c41da3e60z';
const ruleId: string = 'a17913e9-e737-4839-880f-a3ae4df9b081';

class GetRatesFixture extends BaseFixture {
  public async apply(): Promise<void> {

    await this.connection.collection('integrations').insertOne(integrationFactory({
      _id: integrationId,
      name: 'test',
    }));

    await this.connection.collection('integrations').insertOne(integrationFactory({
      _id: customIntegrationId,
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

    await this.connection.collection('shippingorigins').insertOne({
      _id: noDefaultOriginId,
      isDefault: false,
      streetName: `Street name`,
      streetNumber: '111',
      city: `city`,
      zipCode: '11111',
      countryCode: `CO`,
    });

    await this.connection.collection('shippingzones').insertOne({
      _id: zoneId,
      name: 'string',
      countryCodes: ['CO'],
      deliveryTimeDays: 5,
      rates: [{
        'name' : 'test',
        'rateType' : 'Customrates',
        "ratePrice" : 1,
        'conditions' : 'NONE',
        'shippingSpeed' : 'Stantard (2 to 4 business days)',
        'price' : 1,
        'autoShow' : false,
    }],
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
      zones: [zoneId],
    });

    await this.connection.collection('shippingsettings').insertOne({
      _id: settingWithoutZones,
      businessId: businessWithoutZones,
      origins: [originId],
      boxes: [boxId],
      zones: [],
    });

    await this.connection.collection('shippingsettings').insertOne({
      _id: settingIdWithNoDefaultOrigin,
      businessId: businessWithNoDefaultOrigin,
      origins: [noDefaultOriginId],
      boxes: [boxId],
      zones: [],
    });

    await this.connection.collection('shippingsettings').insertOne({
      _id: settingIdWithCustomIntegration,
      businessId: businessWithCustomIntegration,
      origins: [originId],
      boxes: [boxId],
      zones: [],
    });

    await this.connection.collection('shippingsettings').insertOne({
      _id: settingIdWithCustomIntegrationWithoutRules,
      businessId: businessWithCustomIntegrationWithoutRules,
      origins: [originId],
      boxes: [boxId],
      zones: [zoneId],
    });

    await this.connection.collection('integrationrules').insertOne({
      _id: ruleId,
      isActive: true,
      flatRate:  1,
    });

    await this.connection.collection('integrationsubscriptions').insertOne({
      _id: integrationSubscriptionId,
      integration: integrationId,
      enabled: true,
      installed: true,
      rules: [ruleId],
    });

    await this.connection.collection('integrationsubscriptions').insertOne({
      _id: customIntegrationSubscriptionId,
      integration: customIntegrationId,
      enabled: true,
      installed: true,
      rules: [ruleId],
    });

    await this.connection.collection('integrationsubscriptions').insertOne({
      _id: customIntegrationSubscriptionWithoutRulesId,
      integration: customIntegrationId,
      enabled: true,
      installed: true,
      rules: [],
    });

    await this.connection.collection('businesses').insertOne(businessFactory({
      _id: businessId,
      integrationSubscriptions: [integrationSubscriptionId],
      settings: [settingId],
    }));

    await this.connection.collection('businesses').insertOne(businessFactory({
      _id: businessWithNoDefaultOrigin,
      integrationSubscriptions: [integrationSubscriptionId],
      settings: [settingIdWithNoDefaultOrigin],
    }));

    await this.connection.collection('businesses').insertOne(businessFactory({
      _id: businessWithCustomIntegration,
      integrationSubscriptions: [customIntegrationSubscriptionId],
      settings: [settingId],
    }));

    await this.connection.collection('businesses').insertOne(businessFactory({
      _id: businessWithoutZones,
      integrationSubscriptions: [integrationSubscriptionId],
      settings: [settingWithoutZones],
    }));

    await this.connection.collection('businesses').insertOne(businessFactory({
      _id: businessWithCustomIntegrationWithoutRules,
      integrationSubscriptions: [customIntegrationSubscriptionWithoutRulesId],
      settings: [settingIdWithCustomIntegrationWithoutRules],
    }));

    await this.connection.collection('channelsets').insertOne({
      _id: channelSetId,
      businessId: businessId,
    });

    await this.connection.collection('channelsets').insertOne({
      _id: channelSetWithFakeBusinessId,
      businessId: fakeBusinessId,
    });

    await this.connection.collection('channelsets').insertOne({
      _id: channelSetWithNoDefaultOrigin,
      businessId: businessWithNoDefaultOrigin,
    });

    await this.connection.collection('channelsets').insertOne({
      _id: channelSetWithCustomIntegration,
      businessId: businessWithCustomIntegration,
    });

    await this.connection.collection('channelsets').insertOne({
      _id: channelSetWithCustomIntegrationWithoutRules,
      businessId: businessWithCustomIntegrationWithoutRules,
    });

    await this.connection.collection('channelsets').insertOne({
      _id: channelSetWithoutZones,
      businessId: businessWithoutZones,
    });

    const shippingMethod: ShippingMethodModel = shippingMethodFactory({
      _id: shippingMethodId,
      businessId: businessId,
      integration: integrationId,
      integrationRule: [ruleId],
    });
    await this.connection.collection('shippingmethods').insertOne(shippingMethod);
  }
}

export = GetRatesFixture;
