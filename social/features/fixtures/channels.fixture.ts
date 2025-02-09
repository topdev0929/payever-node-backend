import { BaseFixture } from '@pe/cucumber-sdk';
import { RuleTypeEnum } from '../../src/social/enums';
const businessId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527304';
const channelSetId: string = 'dac8cff5-dfc5-4461-b0e3-b25839527305';

class BusinessesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('businesses').insertOne({
      _id : businessId,
      companyAddress : {
        _id : '58a9ff1e-5789-4ca3-b3b1-58142225c7de',
        country : 'AM',
      },
    });

    await this.connection.collection('channelsets').insertOne({
      _id: channelSetId,
      businessId: businessId,
      type: 'facebook',
    });

    await this.connection.collection('rules').insertOne({
      _id: channelSetId,
      integrationName: 'facebook',
      message: 'title is required',
      property: 'title',
      type: RuleTypeEnum.Required,
      value: 0,
    });
  }
}

export = BusinessesFixture;
