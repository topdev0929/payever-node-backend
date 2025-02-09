import { BusinessFactory, BlogFactory, BlogAccessConfigFactory } from '../factories';
import { BUSINESS_ID, CHANNEL_SET_ID, BlogFixtureBase, BLOG_ID, SITE_ACCESS_CONFIG_ID } from './blog.fixture.base';

const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class UpdateBlogAccessAlreadyLiveFixture extends BlogFixtureBase {
  public async apply(): Promise<void> {
    await super.apply();

    await this.businessModel.create(BusinessFactory.create({
      _id: ANOTHER_BUSINESS_ID,
    }));

    await this.blogAcessConfigModel.create(BlogAccessConfigFactory.create({
      _id: SITE_ACCESS_CONFIG_ID,
      isLive: true,
      blog: BLOG_ID,
    }));

    await this.blogModel.create(BlogFactory.create({
      _id: BLOG_ID,
      accessConfig: SITE_ACCESS_CONFIG_ID,
      business: BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
      name: 'Test update',
    }));
  }
}

export = UpdateBlogAccessAlreadyLiveFixture;
