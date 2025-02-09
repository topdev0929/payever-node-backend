import { InjectModel } from '@nestjs/mongoose';
import { ProductBaseModel } from '../models/product-base.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductBaseService {
  constructor(@InjectModel('ProductBase') private readonly productBaseModel: Model<ProductBaseModel>) { }

  public async isSkuUsed(businessId: string, sku: string, productId: string): Promise<boolean> {
    const existing: ProductBaseModel = await this.productBaseModel.findOne({
      _id: { $ne: productId },
      businessId,
      sku,
    });

    return Boolean(existing);
  }
}
