import { BusinessFactory, BlogFactory } from '../factories';
import { BUSINESS_ID, CHANNEL_SET_ID, BlogFixtureBase, BLOG_ID } from './blog.fixture.base';

const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const DEFAULT_SITE_ID: string = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

class SetDefaultBlogFixture extends BlogFixtureBase {
  public async apply(): Promise<void> {
    await super.apply();

    await this.businessModel.create(BusinessFactory.create({
      _id: ANOTHER_BUSINESS_ID,
    }));
    
    await this.blogModel.create(BlogFactory.create({
      _id: BLOG_ID,
      business: BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
      name: 'Test update',
      isDefault: false,
    }));

    await this.blogModel.create(BlogFactory.create({
      _id: DEFAULT_SITE_ID,
      business: BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
      name: 'Default Blog',
      isDefault: true,
    }));
  }
}

export = SetDefaultBlogFixture;
