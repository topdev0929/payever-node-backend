import { BusinessFactory, BlogFactory, BlogAccessConfigFactory } from './factories';
import { BUSINESS_ID, CHANNEL_SET_ID, BlogFixtureBase, BLOG_ID } from './blog/blog.fixture.base';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPageSchemaName } from '../../src/mongoose-schema/mongoose-schema.names';
import { Populable } from '../../src/dev-kit-extras/population';
import { BlogPageModel } from '../../src/blog/models';

const PAGE_ID: string = 'aaaaaaaa-aaaa-aaaa-1234-aaaaaaaaaaaa';
const BLOG_PAGE_ID: string = '22222222-2222-2222-wwww-222222222222';
const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const SITE_ACCESS_CONFIG_ID: string = '22222222-2222-2222-2222-222222222222';

class BlogPageFixture extends BlogFixtureBase {
  protected readonly blogPageModel: Model<Populable<BlogPageModel>> 
    = this.application.get(getModelToken(BlogPageSchemaName));

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

    await this.blogPageModel.create({
      _id: BLOG_PAGE_ID,
      author: 'author',
      body: 'body',
      blog: BLOG_ID,
      caption: 'caption',
      description: 'description',
      image: 'image',
      pageId: PAGE_ID,
      subtitle: 'subtitle',
      title: 'title',
    } as any);
  }
}

export = BlogPageFixture;
