import { BusinessFactory, BlogFactory } from '../factories';
import { BlogFixtureBase, CHANNEL_SET_ID } from './blog.fixture.base';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const OCCUPIED_SITE_NAME: string = 'Test Blog';

class CreateBlogOccupiedNameFixture extends BlogFixtureBase {
  public async apply(): Promise<void> {
    await super.apply();

    await this.businessModel.create(BusinessFactory.create({
      _id: ANOTHER_BUSINESS_ID,
    }));

    await this.blogModel.create(BlogFactory.create({
      business: BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
      name: OCCUPIED_SITE_NAME,
    }));
  }
}

export = CreateBlogOccupiedNameFixture;
