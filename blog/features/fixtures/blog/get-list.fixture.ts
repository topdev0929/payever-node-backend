import { BusinessFactory, BlogFactory } from '../factories';
import { BUSINESS_ID, CHANNEL_SET_ID, BlogFixtureBase } from './blog.fixture.base';

const SITE_ID_1: string = '11111111-1111-1111-1111-111111111111';
const SITE_ID_2: string = '22222222-2222-2222-2222-222222222222';
const ANOTHER_BUSINESS_SITE_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class GetListFixture extends BlogFixtureBase {
  public async apply(): Promise<void> {
    await super.apply();

    await this.businessModel.create(BusinessFactory.create({
      _id: ANOTHER_BUSINESS_ID,
      channelSets: [CHANNEL_SET_ID],
    }));

    await this.blogModel.create(BlogFactory.create({
      _id: SITE_ID_1,
      business: BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
    }));

    await this.blogModel.create(BlogFactory.create({
      _id: SITE_ID_2,
      business: BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
    }));

    await this.blogModel.create(BlogFactory.create({
      _id: ANOTHER_BUSINESS_SITE_ID,
      business: ANOTHER_BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
    }));
  }
}

export = GetListFixture;
