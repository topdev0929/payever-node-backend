import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { BlogAccessConfigFactory, BlogFactory, BusinessFactory, ChannelFactory, ChannelSetFactory } from '../factories';
import { BusinessModel } from '../../../src/business/models';
import { ChannelModel, ChannelSchemaName, ChannelSetModel, ChannelSetSchemaName } from '@pe/channels-sdk';
import { Populable } from '../../../src/dev-kit-extras/population';
import { BlogAccessConfigModel, BlogModel, DomainModel } from '../../../src/blog/models';
import { BusinessSchemaName, BlogAccessConfigSchemaName, BlogSchemaName, DomainSchemaName  } from '../../../src/mongoose-schema/mongoose-schema.names';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const CHANNEL_ID: string = 'channeli-dcha-nnel-idch-annelidchann';
const CHANNEL_SET_ID: string = 'channels-etid-chan-nels-etidchannels';
const ACCESS_CONFIG_ID: string = '22222222-2222-2222-2222-222222222222';
const DOMAIN_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

const BLOG_ID: string = '11111111-1111-1111-1111-111111111111';

class DeleteBusinessFixture extends BaseFixture {
  protected readonly businessModel: Model<Populable<BusinessModel>> = this.application.get(getModelToken(BusinessSchemaName));
  protected readonly channelModel: Model<Populable<ChannelModel>> = this.application.get(getModelToken(ChannelSchemaName));
  protected readonly channelSetModel: Model<Populable<ChannelSetModel>> = this.application.get(getModelToken(ChannelSetSchemaName));
  protected readonly blogModel: Model<Populable<BlogModel>> = this.application.get(getModelToken(BlogSchemaName));
  protected readonly blogAcessConfigModel: Model<Populable<BlogAccessConfigModel>> = this.application.get(getModelToken(BlogAccessConfigSchemaName));
  protected readonly domainModel: Model<Populable<DomainModel>> = this.application.get(getModelToken(DomainSchemaName));

  public async apply(): Promise<void> {
    await this.channelModel.create(ChannelFactory.create({
      _id: CHANNEL_ID,
    }));

    await this.channelSetModel.create(ChannelSetFactory.create({
      _id: CHANNEL_SET_ID,
      channel: CHANNEL_ID,
    }));

    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      channelSets: [CHANNEL_SET_ID],
      blogs: [BLOG_ID]
    }));

    
    await this.domainModel.create({
      _id: DOMAIN_ID,
      name: 'test.domain',
      blog: BLOG_ID,
      isConnected: false,
    });

    await this.blogModel.create(BlogFactory.create({
      _id: BLOG_ID,
      business: BUSINESS_ID,
      channelSet: CHANNEL_SET_ID,
      name: 'test',
    }));

    await this.blogAcessConfigModel.create(BlogAccessConfigFactory.create({
      _id: ACCESS_CONFIG_ID,
      blog: BLOG_ID,
      business: BUSINESS_ID,
    } as any));
  }
}

export = DeleteBusinessFixture;