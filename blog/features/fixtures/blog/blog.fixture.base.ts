import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { BusinessFactory, ChannelFactory, ChannelSetFactory } from '../factories';
import { BusinessModel } from '../../../src/business/models';
import { ChannelModel, ChannelSchemaName, ChannelSetModel, ChannelSetSchemaName } from '@pe/channels-sdk';
import { Populable } from '../../../src/dev-kit-extras/population';
import { BlogAccessConfigModel, BlogModel } from '../../../src/blog/models';
import { BusinessSchemaName, BlogAccessConfigSchemaName, BlogSchemaName  } from '../../../src/mongoose-schema/mongoose-schema.names';

export const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
export const CHANNEL_ID: string = 'channeli-dcha-nnel-idch-annelidchann';
export const CHANNEL_SET_ID: string = 'channels-etid-chan-nels-etidchannels';
export const SITE_ACCESS_CONFIG_ID: string = '22222222-2222-2222-2222-222222222222';

export const BLOG_ID: string = '11111111-1111-1111-1111-111111111111';

export abstract class BlogFixtureBase extends BaseFixture {
  protected readonly businessModel: Model<Populable<BusinessModel>> = this.application.get(getModelToken(BusinessSchemaName));
  protected readonly channelModel: Model<Populable<ChannelModel>> = this.application.get(getModelToken(ChannelSchemaName));
  protected readonly channelSetModel: Model<Populable<ChannelSetModel>> = this.application.get(getModelToken(ChannelSetSchemaName));
  protected readonly blogModel: Model<Populable<BlogModel>> = this.application.get(getModelToken(BlogSchemaName));
  protected readonly blogAcessConfigModel: Model<Populable<BlogAccessConfigModel>> = this.application.get(getModelToken(BlogAccessConfigSchemaName));

  public async apply(): Promise<void> {
    const channel = await this.channelModel.create(ChannelFactory.create({
      _id: CHANNEL_ID,
    }));
    const channelSet = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: CHANNEL_SET_ID,
      channel: CHANNEL_ID,
    }));
    const business = await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      channelSets: [CHANNEL_SET_ID],
    }));
  }
}
