/* tslint:disable:object-literal-sort-keys */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mutex } from '@pe/nest-kit/modules/mutex';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessService } from '@pe/business-kit';

import { BusinessModel } from '../../../business/models';
import { UpdateProductDto } from '../dto';
import { MongooseModel as ProductsMongooseModel } from '../enums/index';
import { CartItemInterface } from '../interfaces';
import { BusinessLastSoldProductsListModel, BusinessProductAggregateModel, ProductModel } from '../models';

const PRODUCT_AGGREGATE_LOCK_NAME: string = 'widgets-business-product';

@Injectable()
export class BusinessProductsService {
  constructor(
    private readonly businessService: BusinessService,
    @InjectModel(ProductsMongooseModel.BusinessProductAggregate)
      private readonly businessProductAggregateModel: Model<BusinessProductAggregateModel>,
    @InjectModel(ProductsMongooseModel.BusinessLastSoldProductsList)
      private readonly businessLastSoldProductsListModel: Model<BusinessLastSoldProductsListModel>,
    private readonly mutex: Mutex,
  ) { }

  public async updateCartItem(
    product: UpdateProductDto,
    date?: string,
  ): Promise<void> {
    const business: BusinessModel = await this.businessService
    .findOneById(product.businessUuid) as unknown as BusinessModel;
    let cartItem: any = await this.businessProductAggregateModel.findOne({ uuid: product.uuid }).exec();
    cartItem = {
      _id: product.uuid,
      identifier: product.identifier, // have no transactions yet
      name: product.title,
      price: product.salePrice,
      price_net: product.price,
      quantity: cartItem && cartItem.quantity ? cartItem.quantity : 0,
      thumbnail: product.images[0],
      uuid: product.uuid,
      vat_rate: cartItem && cartItem.vat_rate ? cartItem.vat_rate : 0,
    };

    await this.aggregateProductSells(business, cartItem, date);
    await this.addLastSoldProduct(business, cartItem, date);
  }

  public async processCartItem(
    business: BusinessModel,
    cartItem: CartItemInterface,
    date?: string,
  ): Promise<void> {
    await this.aggregateProductSells(business, cartItem, date);
    await this.addLastSoldProduct(business, cartItem, date);
  }

  public async removeUuid(
    productId: string,
    businessId: string,
  ): Promise<void> {
    await this.mutex.lock(
      PRODUCT_AGGREGATE_LOCK_NAME,
      businessId + productId,
      async () => {
        await this.businessProductAggregateModel.updateOne(
          {
            uuid: productId,
          },
          {
            $set: {
              uuid: '',
            },
          },
        ).exec();
      },
    );
  }

  public async aggregateProductSells(
    business: BusinessModel,
    cartItem: CartItemInterface,
    date?: string,
  ): Promise<void> {
    await this.mutex.lock(
      PRODUCT_AGGREGATE_LOCK_NAME,
      business.id + cartItem.uuid,
      async () => this.aggregateProductSellsOriginal(business, cartItem, date),
    );
  }

  public async addLastSoldProduct(
    business: BusinessModel,
    cartItem: CartItemInterface,
    date?: string,
  ): Promise<void> {
    await this.businessLastSoldProductsListModel.updateOne(
      { _id: business.id },
      {
        $setOnInsert: {
          _id: business.id,
        },
        $push: {
          products: {
            $each: [
              {
                _id: cartItem._id,
                uuid: cartItem.uuid,
                name: cartItem.name,
                thumbnail: cartItem.thumbnail,
                quantity: cartItem.quantity,
                lastSell: date ? new Date(date) : new Date(),
                price: cartItem.price_net,
                salePrice: cartItem.price,
              } as ProductModel,
            ],
            $sort: {
              lastSell: -1,
            },
            $slice: 10,
          },
        },
      },
      {
        upsert: true,
      },
    ).exec();
  }

  public async deleteLastSoldProductsList(business: BusinessModel): Promise<void> {
    await this.businessLastSoldProductsListModel.deleteOne({ _id: business.id }).exec();
  }

  public async deleteProductsAggregate(business: BusinessModel): Promise<void> {
    await this.businessProductAggregateModel.deleteMany({ businessId: business.id }).exec();
  }

  private async aggregateProductSellsOriginal(
    business: BusinessModel,
    cartItem: CartItemInterface,
    date?: string,
  ): Promise<void> {
    if (!cartItem._id) {
      return;
    }
    await this.businessProductAggregateModel.findOneAndUpdate(
      {
        id: cartItem._id,
        businessId: business.id,
      },
      {
        $setOnInsert: {
          _id: uuid(),
          id: cartItem._id,
          businessId: business.id,
          uuid: cartItem.uuid,
        },
        $set: {
          name: cartItem.name,
          thumbnail: cartItem.thumbnail,
          lastSell: new Date(date),
          price: cartItem.price_net,
          salePrice: cartItem.price,
        },
        $inc: {
          quantity: cartItem.quantity,
        },
      },
      {
        setDefaultsOnInsert: true,
        upsert: true,
      },
    ).exec();
  }
}
