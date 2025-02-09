import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { ChannelSetModel } from '../../../statistics/models';
import { MongooseModel as ProductsMongooseModel } from '../enums/index';
import { CartItemInterface } from '../interfaces';
import { ChannelSetLastSoldProductsListModel, ChannelSetProductAggregateModel, ProductModel } from '../models';

@Injectable()
export class ChannelSetProductsService {

  constructor(
    @InjectModel(ProductsMongooseModel.ChannelSetProductAggregate)
      private readonly channelSetProductAggregateModel: Model<ChannelSetProductAggregateModel>,
    @InjectModel(ProductsMongooseModel.ChannelSetLastSoldProductsList)
      private readonly channelSetLastSoldProductsListModel: Model<ChannelSetLastSoldProductsListModel>,
  ) { }

  public async processCartItem(
    channelSet: ChannelSetModel,
    cartItem: CartItemInterface,
    date?: string,
  ): Promise<void> {
    await this.aggregateProductSells(channelSet, cartItem, date);
    await this.addLastSoldProduct(channelSet, cartItem, date);
  }

  public async aggregateProductSells(
    channelSet: ChannelSetModel,
    cartItem: CartItemInterface,
    date?: string,
  ): Promise<void> {
    await this.channelSetProductAggregateModel.findOneAndUpdate(
      {
        channelSet: channelSet.id,
        id: cartItem._id,
      },
      {
        $inc: {
          quantity: cartItem.quantity,
        },
        $set: {
          channelSet: channelSet.id,
          id: cartItem._id,
          lastSell: new Date(date),
          name: cartItem.name,
          price: cartItem.price_net,
          salePrice: cartItem.price,
          thumbnail: cartItem.thumbnail,
          uuid: cartItem.uuid,
        },
        $setOnInsert: {
          _id: uuid(),
        },
      },
      {
        setDefaultsOnInsert: true,
        upsert: true,
      },
    ).exec();
  }

  public async addLastSoldProduct(
    channelSet: ChannelSetModel,
    cartItem: CartItemInterface,
    date?: string,
  ): Promise<void> {
    await this.channelSetLastSoldProductsListModel.updateOne(
      { _id: channelSet.id },
      {
        $push: {
          products: {
            $each: [
              {
                _id: cartItem._id,
                lastSell: new Date(date),
                name: cartItem.name,
                price: cartItem.price_net,
                quantity: cartItem.quantity,
                salePrice: cartItem.price,
                thumbnail: cartItem.thumbnail,
                uuid: cartItem.uuid,
              } as ProductModel,
            ],
            $slice: 10,
            $sort: {
              lastSell: -1,
            },
          },
        },
        $setOnInsert: {
          _id: channelSet.id,
        },
      },
      {
        upsert: true,
      },
    ).exec();
  }

  public async deleteLastSoldProductsList(channelSet: ChannelSetModel): Promise<void> {
    await this.channelSetLastSoldProductsListModel.deleteOne({ _id: channelSet.id }).exec();
  }

  public async deleteProductsAggregate(channelSet: ChannelSetModel): Promise<void> {
    await this.channelSetProductAggregateModel.deleteMany({ channelSet: channelSet.id }).exec();
  }

}
