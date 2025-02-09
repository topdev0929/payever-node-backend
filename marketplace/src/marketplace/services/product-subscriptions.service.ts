import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductSubscriptionSchemaName } from '../schemas';
import { Model } from 'mongoose';
import { BusinessModel, ProductModel, ProductSubscriptionModel } from '../interfaces/entities';
import { EventDispatcher } from '@pe/nest-kit';
import { ProductSubscriptionEventsEnum } from '../enums';
import { CreateSubscriptionDto } from '../dto';
import { ProductMessagesProducer } from './product-messages.producer';

@Injectable()
export class ProductSubscriptionsService {
  constructor(
    @InjectModel(ProductSubscriptionSchemaName)
      private readonly productSubscriptionModel: Model<ProductSubscriptionModel>,
    private readonly eventDispatcher: EventDispatcher,
    private readonly productMessagesProducer: ProductMessagesProducer,
  ) { }

  public async subscribeToProduct(
    product: ProductModel,
    business: BusinessModel,
    dto: CreateSubscriptionDto,
  ): Promise<ProductSubscriptionModel> {
    const subscription: ProductSubscriptionModel = await this.productSubscriptionModel.create({
      businessId: business._id,
      marketplaceProduct: product.id,
      productId: dto.product.id,
    });

    await this.eventDispatcher.dispatch(ProductSubscriptionEventsEnum.Created, subscription);

    return subscription;
  }

  public async unsubscribeFromProduct(product: ProductModel, business: BusinessModel): Promise<void> {
    await this.productSubscriptionModel.deleteOne({
      businessId: business._id,
      marketplaceProduct: product.id,
    });
  }

  public async removeSubscriptionsForMarketplaceProduct(product: ProductModel): Promise<void> {
    const subscriptions: ProductSubscriptionModel[] =
      await this.productSubscriptionModel.find({ marketplaceProduct: product.id }).populate('business');
    let promises: Array<Promise<any>> = [];
    const messagesBatchSize: number = 10;

    for (const subscription of subscriptions) {
      promises.push(this.productMessagesProducer.produceProductSubscriptionRemoved(product, subscription));

      if (messagesBatchSize === promises.length) {
        await Promise.all(promises);
        promises = [];
      }
    }

    if (promises.length) {
      await Promise.all(promises);
    }

    await this.productSubscriptionModel.deleteMany({ marketplaceProduct: product.id });
  }

  public async deleteSubscriptionByProductId(productId: string): Promise<void> {
    await this.productSubscriptionModel.deleteOne({ productId });
  }
}
