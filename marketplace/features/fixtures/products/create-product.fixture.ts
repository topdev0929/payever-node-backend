import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessFactory, ChannelFactory } from '../factories';
import { BusinessModel } from '../../../src/marketplace/interfaces';
import { BusinessSchemaName } from '../../../src/marketplace/schemas';
import { ChannelModel, ChannelSchemaName } from '@pe/channels-sdk';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class CreateProductNoIntegrationsFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly channelModel: Model<ChannelModel> = this.application.get(getModelToken(ChannelSchemaName));

  public async apply(): Promise<void> {
    await this.channelModel.create(ChannelFactory.create({ }));

    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      name: 'test',
    }));
  }
}

export = CreateProductNoIntegrationsFixture;
