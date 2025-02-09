import { BaseFixture } from '@pe/cucumber-sdk';

const businessId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527304';
const channelId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527207';
const channelSetId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527307';
const terminalId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527305';
const terminalIdTwo: string = 'dac8cff5-dfc5-4461-b0e3-b25839527315';

class BusinessesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('businesses').insertOne({
      _id : businessId,
      defaultLanguage: 'en',
      terminals: [terminalId, terminalIdTwo],
    });
    await this.connection.collection('channels').insertOne({
      _id : channelId,
      type: 'pos',
    });
    await this.connection.collection('channelsets').insertOne({
      _id : channelSetId,
      channel: channelId,
    });
  }
}

export = BusinessesFixture;
