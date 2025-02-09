import { BaseFixture } from '@pe/cucumber-sdk';
import { PluginCommandNameEnum } from '../../src/plugin/enums';

const channelType: string = 'magento';
const defaultCreatedAt: Date = new Date("2019-07-09T09:09:44.281Z");

class PluginCommandsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('plugincommands').insertMany([
      {
        "_id" : "d73635ff-51da-41ca-bfab-f08052de6163",
        "createdAt": new Date("2019-08-09T09:09:44.281Z"),
        "name" : PluginCommandNameEnum.SetLiveHost,
        "value" : "https://stub-live.host",
      },
      {
        "_id" : "42e7b64f-86d6-43c6-b81f-0812a2cf51da",
        "channelType" : channelType,
        "createdAt": defaultCreatedAt,
        "maxCmsVersion" : "2.1.0",
        "metadata" : {
          "filename" : "https://payeverproduction.blob.core.windows.net/payever-magento2-payments-1.0.0.zip",
        },
        "minCmsVersion" : "2.0.0",
        "name" : PluginCommandNameEnum.NotifyNewPluginVersion,
        "value" : "1.0.0",
      },
      {
        "_id" : "42e7b64f-86d6-43c6-b81f-0812a2cf51d1",
        "channelType" : channelType,
        "createdAt": defaultCreatedAt,
        "maxCmsVersion" : "2.1.0",
        "metadata" : {
          "filename" : "https://payeverproduction.blob.core.windows.net/payever-magento2-payments-1.5.0.zip",
        },
        "minCmsVersion" : "2.0.0",
        "name" : PluginCommandNameEnum.NotifyNewPluginVersion,
        "value" : "1.5.0",
      },
      {
        "_id" : "42e7b64f-86d6-43c6-b81f-0812a2cf51d2",
        "channelType" : channelType,
        "createdAt": defaultCreatedAt,
        "maxCmsVersion" : "2.3.0",
        "metadata" : {
          "filename" : "https://payeverproduction.blob.core.windows.net/payever-magento2-payments-1.6.0.zip",
        },
        "minCmsVersion" : "2.1.0",
        "name" : PluginCommandNameEnum.NotifyNewPluginVersion,
        "value" : "1.6.0",
      },
      {
        "_id" : "42e7b64f-86d6-43c6-b81f-0812a2cf51d3",
        "channelType" : channelType,
        "createdAt": defaultCreatedAt,
        "maxCmsVersion" : "2.3.0",
        "metadata" : {
          "filename" : "https://payeverproduction.blob.core.windows.net/payever-magento2-payments-1.7.0.zip",
        },
        "minCmsVersion" : "2.2.0",
        "name" : PluginCommandNameEnum.NotifyNewPluginVersion,
        "value" : "1.7.0",
      },
      {
        "_id" : "42e7b64f-86d6-43c6-b81f-0812a2cf51d4",
        "channelType" : 'shopware',
        "createdAt": defaultCreatedAt,
        "maxCmsVersion" : "5.6.0",
        "metadata" : {
          "filename" : "https://payeverproduction.blob.core.windows.net/payever-shopware-payments-1.0.0.zip",
        },
        "minCmsVersion" : "5.2.17",
        "name" : PluginCommandNameEnum.NotifyNewPluginVersion,
        "value" : "2.0.0",
      },
    ]);
  }
}

export = PluginCommandsFixture;
