import { BaseFixture } from '@pe/cucumber-sdk';

const pluginId: string = '7d6f6431-a7b1-40ab-b0b7-15aede2a2653';
const channelId: string = '67d580f7-ebf5-40e4-9367-63b8b0e0ae26';
const businessId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527304';

class CommonPluginFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('plugins').insertOne({
      "_id" : pluginId,
      "channel" : channelId,
      "description" : "description 1",
      "documentation" : "https://getpayever.com/shopsystem/magento/",
      "marketplace" : "https://marketplace.magento.com/payever-magento2-payments.html",
      "pluginFiles" : [],
    });

    await this.connection.collection('plugininstanceregistries').insertOne({
      "_id" : pluginId,
      "channel" : channelId,
      "acknowledgedCommands": ["d73635ff-51da-41ca-bfab-f08052de6163"],
      "businessIds": [businessId],
      "cmsVersion": "cms",
      "host": "http",
      "pluginVersion": "1.00",
      "supportedCommands": ["set-command-host"],
    });
  }
}

export = CommonPluginFixture;
