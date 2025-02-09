import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ChannelSetSlugModel } from '../../../../src/channel-set/models';
import { ChannelSetSlugSchemaName } from '../../../../src/mongoose-schema';

class ExistingCheckoutSlugFixture extends BaseFixture {
  private readonly model: Model<ChannelSetSlugModel> = this.application.get(getModelToken(ChannelSetSlugSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '25e08dec-84c9-4062-8ee6-155ef6c1ffa0',
      lastUse: new Date('2019-12-31 00:00:00'),
      slug: '999999/other_shopsystem/other_shopsystem',
      used: 1,
    } as any);
  }
}

export = ExistingCheckoutSlugFixture;
