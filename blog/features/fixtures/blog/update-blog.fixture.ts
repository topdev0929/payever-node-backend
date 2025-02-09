import { BusinessFactory, BlogFactory, BlogAccessConfigFactory } from '../factories';
import { BUSINESS_ID, CHANNEL_SET_ID, BlogFixtureBase, BLOG_ID } from './blog.fixture.base';

const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const SITE_ACCESS_CONFIG_ID: string = '22222222-2222-2222-2222-222222222222';

class UpdateBlogFixture extends BlogFixtureBase {
  public async apply(): Promise<void> {
    await super.apply();

    await this.businessModel.create(BusinessFactory.create({
      _id: ANOTHER_BUSINESS_ID,
    }));

    await this.blogAcessConfigModel.create(BlogAccessConfigFactory.create({
      _id: SITE_ACCESS_CONFIG_ID,
      blog: BLOG_ID,
      internalDomainPattern: 'test-update',
    }));

    await this.blogModel.create(BlogFactory.create({
      _id: BLOG_ID,
      accessConfig: SITE_ACCESS_CONFIG_ID,
      business: BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
      name: 'Test update',
    } as any));
  }
}

export = UpdateBlogFixture;
