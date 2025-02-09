import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { DomainSchemaName, BlogAccessConfigSchemaName, BlogSchemaName  } from '../../../src/mongoose-schema/mongoose-schema.names';
import { Populable } from '../../../src/dev-kit-extras';
import { BlogAccessConfigModel, BlogModel, DomainModel } from '../../../src/blog/models';
import { ChannelSetFactory, BlogAccessConfigFactory, BlogFactory,  } from '../factories';
import { ChannelSetModel, ChannelSetSchemaName } from '@pe/channels-sdk';

const APPLICATION_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const CHANNELSET_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const DOMAIN_ID: string = 'a8c099a0-35f2-48c6-96cd-17282ad8a062';

class ApplicationExistsFixture extends BaseFixture {
  private channelSetModel: Model<Populable<ChannelSetModel>> = this.application.get(getModelToken(ChannelSetSchemaName));
  private blogModel: Model<Populable<BlogModel>> = this.application.get(getModelToken(BlogSchemaName));
  private blogAccessConfigModel: Model<Populable<BlogAccessConfigModel>> = this.application.get(getModelToken(BlogAccessConfigSchemaName));
  protected readonly domainModel: Model<Populable<DomainModel>> = this.application.get(getModelToken(DomainSchemaName));

  public async apply(): Promise<void> {
    await this.createBlog(
      {
        _id: APPLICATION_ID,
        business: BUSINESS_ID,
      },
      CHANNELSET_ID,
    );
  }

  private async createBlog(blogPrototype: Partial<Populable<BlogModel>>, channelId: string): Promise<Populable<BlogModel>> {
    const channelSet = await this.channelSetModel.create(ChannelSetFactory.create(
        {
          business: blogPrototype.business,
          channel: channelId,
        } as any,
      ),
    );

    const blog = await this.blogModel.create(BlogFactory.create(
        {
          ...blogPrototype,
          channelSet: channelSet._id,
        },
      ),
    );

    await this.blogAccessConfigModel.create(BlogAccessConfigFactory.create(
      {
          isLive: true,
          ownDomain: `${blogPrototype.id}.test.com`,
          blog: blog._id,
        },
      ),
    );

    await this.domainModel.create(
      {
        _id: DOMAIN_ID,
        isConnected: false,
        name: 'test.payever.me',
        blog: blog._id,
      },
    );

    return blog;
  }
}

export = ApplicationExistsFixture;
