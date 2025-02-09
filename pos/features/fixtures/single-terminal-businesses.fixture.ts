import { BaseFixture } from '@pe/cucumber-sdk';

const businessId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527304';
const channelId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527307';
const terminalId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527305';

class BusinessesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('businesses').insertOne({
      _id : businessId,
      defaultLanguage: 'en',
      terminals: [terminalId]
    });
    await this.connection.collection('channels').insertOne({
      _id : channelId,
      type: 'pos',
    });
  }
}

export = BusinessesFixture;
