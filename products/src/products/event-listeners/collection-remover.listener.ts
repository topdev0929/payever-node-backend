import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { CollectionEventsEnum } from '../../categories/enums';
import { CollectionModel } from '../../categories/models';
import { ProductService } from '../services';
import { ProductsCollectionsEventsProducer } from './../../categories/producers';

@Injectable()
export class CollectionRemoverListener {
  constructor(
    private readonly productsService: ProductService,
    private readonly productsCollectionsEventsProducer: ProductsCollectionsEventsProducer, 
  ) { }
  
  @EventListener(CollectionEventsEnum.CollectionRemoved)
  public async onCollectionRemoved(collection: CollectionModel): Promise<void>  {
    await this.productsService.removeCollectionFromProducts(collection);
    await this.productsCollectionsEventsProducer.productsCollectionRemoved(collection);
  }
}
