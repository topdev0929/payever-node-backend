import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ChannelSetModel } from '../../../src/channel-set';
import { ChannelSetSchemaName } from '../../../src/mongoose-schema';

class ChannelSetWithoutCheckoutFixture extends BaseFixture {
  private readonly model: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: 'f0e4f6fb-ed5d-40ca-b953-253213375e30',
      type: 'magento',
    } as any);
  }
}

export = ChannelSetWithoutCheckoutFixture;
