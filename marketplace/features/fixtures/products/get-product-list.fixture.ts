import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessFactory, ChannelFactory, ChannelSetFactory, ProductFactory } from '../factories';
import { BusinessModel, ProductModel } from '../../../src/marketplace/interfaces';
import { BusinessSchemaName, ProductSchemaName } from '../../../src/marketplace/schemas';
import { ChannelModel, ChannelSchemaName, ChannelSetModel, ChannelSetSchemaName } from '@pe/channels-sdk';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class GetProductListFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly productModel: Model<ProductModel> = this.application.get(getModelToken(ProductSchemaName));
  protected readonly channelModel: Model<ChannelModel> = this.application.get(getModelToken(ChannelSchemaName));
  protected readonly channelSetModel: Model<ChannelSetModel> =
    this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {
    const channel: ChannelModel = await this.channelModel.create(ChannelFactory.create({ }));
    const channelSet: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create(channel));

    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      channelSets: [channelSet.id],
      name: 'test',
    }));

    for (let i: number = 0; i < 10; i++) {
      await this.productModel.create(ProductFactory.create({
        _id: this.createUuid(i.toString()),
        businessId: BUSINESS_ID,
        channelSet: channelSet.id,
        price: i * 100,
        title: `product ${i}`,
      }));
    }
  }

  private createUuid(index: string): string {
    return [
      index.repeat(8),
      index.repeat(4),
      index.repeat(4),
      index.repeat(4),
      index.repeat(12),
    ].join('-');
  }
}

export = GetProductListFixture;
