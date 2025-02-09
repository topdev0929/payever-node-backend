// tslint:disable-next-line:no-require-imports
import CommonPluginFixture = require('./common-plugin.fixture');

const pluginId: string = '7d6f6431-a7b1-40ab-b0b7-15aede2a2653';

class PluginVersionFixture extends CommonPluginFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('plugins').findOneAndUpdate({ _id: pluginId }, {
      $set: {
        "pluginFiles": [
          {
            "filename": "https://payeverproduction.blob.core.windows.net/magento2-payments-1.0.1.zip",
            "maxCmsVersion": "2.1.0",
            "minCmsVersion": "2.0.0",
            "version": "Magento2-v1.0.1",
          },
          {
            "filename": "https://payeverproduction.blob.core.windows.net/magento2-payments-2.13.3.zip",
            "maxCmsVersion": "2.3.0",
            "minCmsVersion": "2.0.0",
            "version": "Magento2-v2.13.3",
          },
          {
            "filename": "https://payeverproduction.blob.core.windows.net/magento1-payments-2.2.0.zip",
            "maxCmsVersion": "1.9.99",
            "minCmsVersion": "1.7.0",
            "version": "Magento1-v2.2.0",
          },
        ],
      },
    });
  }
}

export = PluginVersionFixture;
