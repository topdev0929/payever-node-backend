import { Injectable } from '@nestjs/common';
import { ProductModel } from '../interfaces/entities';
import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { ProductEventEnum } from '../enums';
import { ProductSubscriptionsService } from '../services';
import { FoldersEventsEnum } from '@pe/folders-plugin';

@Injectable()
export class ProductListener {
  constructor(
    private readonly subscriptionsService: ProductSubscriptionsService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @EventListener(ProductEventEnum.ProductCreated)
  public async onProductCreated(product: ProductModel): Promise<void>  {
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionCreateDocument, product);
  }

  @EventListener(ProductEventEnum.ProductUpdated)
  public async onProductUpdated(product: ProductModel): Promise<void>  {
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionUpdateDocument, product);
  }

  @EventListener(ProductEventEnum.ProductRemoved)
  public async onProductRemoved(product: ProductModel): Promise<void>  {
    await this.subscriptionsService.removeSubscriptionsForMarketplaceProduct(product);
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionDeleteDocument, product._id);
  }
}
