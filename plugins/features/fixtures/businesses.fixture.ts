import { BaseFixture } from '@pe/cucumber-sdk';

const businessId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527304';
const channelId: string = '67d580f7-ebf5-40e4-9367-63b8b0e0ae26';

class BusinessesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('businesses').insertOne({
      _id : businessId,
      shopSystems: [businessId],
    });

    await this.connection.collection('shopsystems').insertOne({
      _id : businessId,
      channel: channelId,
      apiKeys: [{
        "_id": "dac8cff5-dfc5-4461-b0e3-b25839527304"
      }]
    });
  }
}

export = BusinessesFixture;
