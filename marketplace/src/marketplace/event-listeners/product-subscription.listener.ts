import { Injectable } from '@nestjs/common';
import { ProductSubscriptionModel } from '../interfaces/entities';
import { ProductsService } from '../services';
import { EventListener } from '@pe/nest-kit';
import { ProductSubscriptionEventsEnum } from '../enums';

@Injectable()
export class ProductSubscriptionListener {
  constructor(
    private readonly productsService: ProductsService,
  ) { }

  @EventListener(ProductSubscriptionEventsEnum.Created)
  public async onSubscriptionCreated(subscription: ProductSubscriptionModel): Promise<void> {
    await subscription.populate('marketplaceProduct').execPopulate();

    await this.productsService.increaseImports(subscription.marketplaceProduct);
  }
}
