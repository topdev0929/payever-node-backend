import { BusinessFactory,  BlogFactory } from '../factories';
import { CHANNEL_SET_ID, BUSINESS_ID, BlogFixtureBase } from './blog.fixture.base';

const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const DEFAULT_BLOG_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

class CreateBlogDefaultExistsFixture extends BlogFixtureBase {
  public async apply(): Promise<void> {
    await super.apply();

    await this.businessModel.create(BusinessFactory.create({
      _id: ANOTHER_BUSINESS_ID,
    }));

    await this.blogModel.create(BlogFactory.create({
      _id: DEFAULT_BLOG_ID,
      business: ANOTHER_BUSINESS_ID,
      name: 'Default blog',
      isDefault: true,
      picture: null,
      channelSet: CHANNEL_SET_ID,
    }));
  }
}

export = CreateBlogDefaultExistsFixture;
