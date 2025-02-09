import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { MessageBusChannelsEnum } from '../../shared';
import { ProductModel } from '../models';
import { ProductVariantModel } from '../models/product-variant.model';

@Controller()
export class RabbitController {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductModel>,
    @InjectModel('ProductVariant') private readonly variantModel: Model<ProductVariantModel>,
  ) {
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: 'subscriptions.product.linked',
  })
  public async onAppToProductLinked(dto: { _id: string; appName: string}): Promise<void> {
    const product: ProductModel =
      await this.productModel.findByIdAndUpdate(dto._id, { $addToSet: { apps: dto.appName } });
    if (!product) {
      await this.variantModel.findByIdAndUpdate(dto._id, { $addToSet: { apps: dto.appName } });
    }
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: 'subscriptions.product.unlinked',
  })
  public async onAppToProductUnlinked(dto: { _id: string; appName: string}): Promise<void> {
    await this.productModel.findByIdAndUpdate(dto._id, { $pull: { apps: dto.appName } });
    await this.variantModel.findByIdAndUpdate(dto._id, { $pull: { apps: dto.appName } });
  }
}
