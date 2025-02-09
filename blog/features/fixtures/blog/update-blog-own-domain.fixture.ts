import { BlogFactory, BlogAccessConfigFactory } from '../factories';
import { BlogFixtureBase, BUSINESS_ID, BLOG_ID, CHANNEL_SET_ID } from './blog.fixture.base';

class UpdateBlogOwnDomainFixture extends BlogFixtureBase {
  public async apply(): Promise<void> {
    await super.apply();

    const blog = await this.blogModel.create(BlogFactory.create({
      _id: BLOG_ID,
      business: BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
      name: 'Test update',
    }));

    await this.blogAcessConfigModel.create(BlogAccessConfigFactory.create({
      ownDomain: 'old-domain.name',
      blog: blog._id,
    }));
  }
}

export = UpdateBlogOwnDomainFixture;
