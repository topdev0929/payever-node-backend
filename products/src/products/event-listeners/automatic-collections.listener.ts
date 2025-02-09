import { Injectable } from '@nestjs/common';
import { CollectionModel } from '../../categories/models';
import { ProductsElasticService, ProductService } from '../services';
import { EventListener } from '@pe/nest-kit';
import { CollectionEventsEnum } from '../../categories/enums';
import { AutomaticFillConditions } from '../../categories/dto';
import * as assert from 'assert';
import { ProductModel } from '../models';
import { AutomaticCollectionConditionsInterface } from '../../categories/interfaces';
import { ProductsCollectionsEventsProducer } from './../../categories/producers';

@Injectable()
export class AutomaticCollectionsListener {

  constructor(
    private readonly productsElasticService: ProductsElasticService,
    private readonly productsService: ProductService,
    private readonly productsCollectionsEventsProducer: ProductsCollectionsEventsProducer,
  ) { }

  @EventListener(CollectionEventsEnum.CollectionCreated)
  public async onCollectionCreated(collection: CollectionModel): Promise<void> {
    if (!this.hasAutoFillConditions(collection)) {
      return ;
    }

    await this.associateProductsByCollectionFilter(collection);
    await this.productsCollectionsEventsProducer.productsCollectionCreated(collection);
  }

  @EventListener(CollectionEventsEnum.CollectionUpdated)
  public async onCollectionUpdated(
    originalCollection: CollectionModel,
    updatedCollection: CollectionModel,
  ): Promise<void> {

    if (!this.hasAutoFillConditions(originalCollection) && !this.hasAutoFillConditions(updatedCollection)) {
      return ;
    }

    const originalConditions: AutomaticCollectionConditionsInterface
      = originalCollection.toObject().automaticFillConditions;
    const updatedConditions: AutomaticCollectionConditionsInterface
      = updatedCollection.toObject().automaticFillConditions;

    if (!this.hasChangedConditions(originalConditions, updatedConditions)) {
      return ;
    }

    await this.productsService.removeCollectionFromProducts(updatedCollection);
    await this.associateProductsByCollectionFilter(updatedCollection);

    if (
      updatedCollection.automaticFillConditions.manualProductsList
      && updatedCollection.automaticFillConditions.manualProductsList.length > 0
    ) {
      await updatedCollection.populate('automaticFillConditions.manualProductsList').execPopulate();
      await this.productsService.associateProductsWithCollection(
        updatedCollection,
        updatedCollection.automaticFillConditions.manualProductsList.map((product: ProductModel) => product.id),
      );
    }
    await this.productsCollectionsEventsProducer.productsCollectionUpdated(originalCollection, updatedCollection);
  }

  private hasAutoFillConditions(collection: CollectionModel): boolean {
    return collection.automaticFillConditions
      && Array.isArray(collection.automaticFillConditions.filters)
      && collection.automaticFillConditions.filters.length > 0;
  }

  private async associateProductsByCollectionFilter(collection: CollectionModel): Promise<void>  {
    if (!collection.automaticFillConditions) {
      return ;
    }

    const productsIdentifiers: string[] = await this.productsElasticService.getProductsIdentifiers(
      { filters: collection.automaticFillConditions.filters },
      collection.businessId,
      collection.automaticFillConditions.strict,
    );
    if (productsIdentifiers.length > 0) {
      await this.productsService.associateProductsWithCollection(collection, productsIdentifiers);
    }
  }

  private hasChangedConditions(
    originalConditions: AutomaticFillConditions,
    updatedConditions: AutomaticFillConditions,
  ): boolean {

    try {
      assert.deepStrictEqual(originalConditions, updatedConditions);
    } catch (e) {
      return true;
    }

    return false;
  }
}
