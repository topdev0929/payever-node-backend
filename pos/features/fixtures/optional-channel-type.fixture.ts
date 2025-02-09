import { BaseFixture } from '@pe/cucumber-sdk';

const businessId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527304';
const channelId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527207';
const channelSetId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527307';
const channelEmail: string = 'dac8cff5-dfc5-4461-b0e3-b25839527207';
const terminalId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527305';
const terminalIdTwo: string = 'dac8cff5-dfc5-4461-b0e3-b25839527315';

class OptionalChannelTypeFixture extends BaseFixture {
  public async apply(): Promise<void> {

    await this.connection.collection('channels').insertOne({
      _id : channelId,
      type: 'pos',
    });

    await this.connection.collection('channelsets').insertOne({
      _id : channelEmail,
      channel: channelId,
      type: 'email',
    });
    await this.connection.collection('channelsets').insertOne({
      _id : channelSetId,
      channel: channelId,
    });

    await this.connection.collection('terminals').insertOne({
      _id: terminalId,
      businessId: businessId,
      channelSets: [channelSetId, channelEmail],
      name: 'test it',
    });

    await this.connection.collection('terminals').insertOne({
      _id: terminalIdTwo,
      businessId: businessId,
      channelSets: [channelSetId, channelEmail],
      name: 'test it two',
    });

    await this.connection.collection('businesses').insertOne({
      _id : businessId,
      channelSets: [channelSetId, channelEmail],
      defaultLanguage: 'en',
      terminals: [terminalId, terminalIdTwo],
    });

  }
}

export = OptionalChannelTypeFixture;
