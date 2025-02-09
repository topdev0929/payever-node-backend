import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ChannelSetSlugModel } from '../../../../src/channel-set/models';
import { ChannelSetSlugSchemaName } from '../../../../src/mongoose-schema';

class ExistingFinanceExpressSlugFixture extends BaseFixture {
  private readonly model: Model<ChannelSetSlugModel> = this.application.get(getModelToken(ChannelSetSlugSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: 'd47d74fb-e768-4dbb-bbf8-66f5140e0f2f',
      lastUse: new Date('2019-12-31 00:00:00'),
      slug: '111111/santander_installments',
      used: 1,
    } as any);
  }
}

export = ExistingFinanceExpressSlugFixture;
