import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseFixture } from "@pe/cucumber-sdk";
import { ChannelModel, ChannelSchemaName, ChannelSetModel, ChannelSetSchemaName } from '@pe/channels-sdk';

import { Populable } from '../../../src/dev-kit-extras/population';

import { BusinessModel } from '../../../src/business/models';
import { BusinessSchemaName, DomainSchemaName, BlogAccessConfigSchemaName, BlogSchemaName  } from '../../../src/mongoose-schema/mongoose-schema.names';
import { BlogAccessConfigModel, BlogModel, DomainModel } from '../../../src/blog/models';
import { BusinessFactory, ChannelFactory, ChannelSetFactory, BlogAccessConfigFactory, BlogFactory } from '../factories';

export const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
export const BLOG_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
export const CHANNEL_SET_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
export const DOMAIN_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
export const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
export const CHANNEL_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

export abstract class DomainFixtureBase extends BaseFixture {
  protected readonly BusinessModel: Model<Populable<BusinessModel>> = this.application.get(getModelToken(BusinessSchemaName));
  protected readonly channelModel: Model<Populable<ChannelModel>> = this.application.get(getModelToken(ChannelSchemaName));
  protected readonly channelSetModel: Model<Populable<ChannelSetModel>> = this.application.get(getModelToken(ChannelSetSchemaName));
  protected readonly blogModel: Model<Populable<BlogModel>> = this.application.get(getModelToken(BlogSchemaName));
  protected readonly blogAccessConfigModel: Model<Populable<BlogAccessConfigModel>> = this.application.get(getModelToken(BlogAccessConfigSchemaName));
  protected readonly domainModel: Model<Populable<DomainModel>> = this.application.get(getModelToken(DomainSchemaName));
  public async apply() {

    const channel = await this.channelModel.create(ChannelFactory.create({
      _id: CHANNEL_ID,
      type: 'blog',
    }));

    const business = await this.BusinessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
    }));

    await this.BusinessModel.create(BusinessFactory.create({
      _id: ANOTHER_BUSINESS_ID,
    }));

    const channelSet = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: CHANNEL_SET_ID,

      business: business._id,
      channel: channel._id,
    } as any));

    const blog = await this.blogModel.create(BlogFactory.create({
      _id: BLOG_ID,
      business: BUSINESS_ID,
      name: 'Test update',
      channelSet: channelSet._id,
    }) as any);

    const accessConfig = await this.blogAccessConfigModel.create({
      isLive: true,
      blog: blog._id,
    } as any);
  }

  protected async createBlog(blogPrototype: Partial<Populable<BlogModel>>, channelId: string): Promise<Populable<BlogModel>> {
    const channelSet = await this.channelSetModel.create(ChannelSetFactory.create({
      channel: channelId,
      business: blogPrototype.business,
    } as any));

    const blog = await this.blogModel.create(BlogFactory.create({
      ...blogPrototype,
      channelSet: channelSet._id,
    }));

    const blogAccessConfig = await this.blogAccessConfigModel.create(BlogAccessConfigFactory.create({
      ownDomain: `${blogPrototype.id}.test.com`,
      blog: blog._id,
      isLive: true,
    }));

    return blog;
  }
}
