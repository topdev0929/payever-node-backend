import { Injectable } from '@nestjs/common';
import { ProductModel } from '../models';
import { EventListener } from '@pe/nest-kit';
import { ProductsEventsEnum } from '../enums';
import { ProductNotificationsService } from '../services';

@Injectable()
export class FirstProductCreatedListener {
  constructor(
    private readonly productNotificationService: ProductNotificationsService,
  ) { }

  @EventListener(ProductsEventsEnum.FirstProductCreated)
  public async onFirstProductCreated(product: ProductModel): Promise<void> {
    await this.productNotificationService.cancelAddProductNotification(product.businessId);
  }
}
