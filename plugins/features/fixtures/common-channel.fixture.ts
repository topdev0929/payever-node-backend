import { BaseFixture } from '@pe/cucumber-sdk';

const channelId: string = '67d580f7-ebf5-40e4-9367-63b8b0e0ae26';
const channelType: string = 'magento';

class CommonChannelFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('channels').insertOne({
      "_id" : channelId,
      "enabled" : true,
      "legacyId" : 7,
      "type" : channelType,
    });
  }
}

export = CommonChannelFixture;
