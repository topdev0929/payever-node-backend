import { BaseFixture } from '@pe/cucumber-sdk';
import { integrationFactory, shippingOrderFactory, businessFactory, shippingMethodFactory } from './factories';
const businessId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527304';
const integrationId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527305';
const integrationId1: string = 'dac8cff5-dfc5-4461-b0e3-b25839527307';

class BusinessesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('businesses').insertOne({
      _id : businessId,
      companyAddress : {
        _id : '58a9ff1e-5789-4ca3-b3b1-58142225c7de',
        country : 'AM',
    },
    });

    await this.connection.collection('integrations').insertOne(integrationFactory({
      _id: integrationId,
      name: 'test',
    }));

    await this.connection.collection('integrations').insertOne(integrationFactory({
      _id: integrationId1,
      name: 'custom',
    }));
  }
}

export = BusinessesFixture;
