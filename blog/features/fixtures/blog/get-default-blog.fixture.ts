import { BlogFactory,  BlogAccessConfigFactory } from '../factories';
import { CHANNEL_SET_ID, SITE_ACCESS_CONFIG_ID, BLOG_ID, BUSINESS_ID, BlogFixtureBase } from './blog.fixture.base';

class GetDefaultBlogFixture extends BlogFixtureBase {
  public async apply(): Promise<void> {
    await super.apply();

    await this.blogAcessConfigModel.create(BlogAccessConfigFactory.create({
      _id: SITE_ACCESS_CONFIG_ID,
      privatePassword: '123',
      blog: BLOG_ID,
    }));

    await this.blogModel.create(BlogFactory.create({
      _id: BLOG_ID,
      accessConfig: SITE_ACCESS_CONFIG_ID,
      business: BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
      isDefault: true,
    }));
  }
}

export = GetDefaultBlogFixture;
