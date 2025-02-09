import { BaseFixture } from '@pe/cucumber-sdk';

const businessId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527304';
const terminalId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527305';
const terminalIdTwo: string = 'dac8cff5-dfc5-4461-b0e3-b25839527315';
const terminalSubId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527306';
const channelSetId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527307';
const terminalConfigId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527308';

class TerminalFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('terminals').insertOne({
      _id: terminalId,
      businessId: businessId,
      channelSets:
        [
          channelSetId,
        ],
      integrationSubscriptions: [terminalSubId],

      active: false,
      defaultLocale: 'en',
      live: true,
      logo: 'logo_url',
      message: 'my terminal',
      name: 'test it',
    });
    await this.connection.collection('terminals').insertOne({
      _id: terminalIdTwo,
      businessId: businessId,
      channelSets:
        [
          channelSetId,
        ],
      integrationSubscriptions: [terminalSubId],

      active: false,
      defaultLocale: 'en',
      live: true,
      logo: 'logo_url',
      message: 'my terminal',
      name: 'test it two',
    });

    await this.connection.collection('terminalaccessconfigs').insertOne({
      _id: terminalConfigId,
      internalDomain: 'new domain',
      internalDomainPattern: 'pattern',
      isLive: true,
      isLocked: false,
      terminal: terminalId,
    });

  }
}

export = TerminalFixture;
