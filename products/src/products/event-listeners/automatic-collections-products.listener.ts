import { Injectable } from '@nestjs/common';
import { CollectionModel } from '../../categories/models';
import { ProductService } from '../services';
import { EventListener } from '@pe/nest-kit';
import { ProductsEventsEnum } from '../enums';
import {
  isObjectAProductModel,
  PopulatedVariantsLeanProduct,
  PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ProductModel,
} from '../models';
import { ConditionsChecker } from '../services/conditions-checker';
import { CollectionsService } from '../../categories/services';
import { ExpandFilterHelper, ProductFieldMapperHelper } from '../helpers';
import { FilterInterface } from '../../common/interfaces/filter.interface';
import { ProductDocumentLikeDto } from '../../bus/product-export-bus.dto';

@Injectable()
export class AutomaticCollectionsProductsListener {

  constructor(
    private readonly productsService: ProductService,
    private readonly conditionsChecker: ConditionsChecker,
    private readonly collectionsService: CollectionsService,
  ) { }

  @EventListener(ProductsEventsEnum.ProductCreated)
  public async onProductCreated(
    product: PopulatedVariantsCategoryCollectionsChannelSetProductModel | ProductDocumentLikeDto,
  ): Promise<void> {
    // Workaround to separate variants create event, since product and it's variants trigger the same event on creation
    if (!isObjectAProductModel(product)) {
      return ;
    }

    await this.associateWithNewCollections(product);
  }

  @EventListener(ProductsEventsEnum.ProductUpdated)
  public async onProductUpdated(
    originalProduct: ProductModel | PopulatedVariantsLeanProduct,
    updatedProduct: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): Promise<void> {
    // Workaround to separate variants update event, since product and it's variants trigger the same event on update
    if (!isObjectAProductModel(updatedProduct)) {
      return ;
    }

    await this.productsService.dissociateProductWithCollections(
      updatedProduct,
      await this.findDissociatedCollections(updatedProduct),
    );

    await this.associateWithNewCollections(updatedProduct);
  }

  private async associateWithNewCollections(
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): Promise<void>  {
    const collections: CollectionModel[] = await this.collectionsService.getListByBusinessId(product.businessId);

    await this.productsService.associateProductWithCollections(
      product,
      await this.findSatisfyingCollections(product, collections),
    );
  }

  private async findSatisfyingCollections(
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    collections: CollectionModel[],
  ): Promise<CollectionModel[]> {
    const found: CollectionModel[] = [];
    for (const collection of collections) {
      if (await this.isSatisfying(product, collection)) {
        found.push(collection);
      }
    }

    return found;
  }

  private async findDissociatedCollections(
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): Promise<CollectionModel[]> {
    const found: CollectionModel[] = [];
    for (const collection of product.collections) {
      if (typeof collection === 'string') { continue; }
      if (
        this.isAutomaticCollection(collection)
        && !await this.isSatisfying(product, collection)
      ) {
        found.push(collection);
      }
    }

    return found;
  }

  private isAutomaticCollection(collection: CollectionModel): boolean {
    return collection.automaticFillConditions
      && collection.automaticFillConditions.filters
      && collection.automaticFillConditions.filters.length > 0;
  }

  private async isSatisfying(
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    collection: CollectionModel,
  ): Promise<any> {
    if (!this.isAutomaticCollection(collection)) {
      return false;
    }

    if (this.isProductAddedManually(collection, product)) {
      return true;
    }

    let doesFilterSatisfy: boolean = true;

    for (const filter of collection.automaticFillConditions.filters) {
      if (!ProductFieldMapperHelper.isFieldAllowed(filter.field)) {
        return false;
      }

      filter.field = ProductFieldMapperHelper.getFieldName(filter.field);
      const expandedFilter: FilterInterface = ExpandFilterHelper.expandChildFilter(filter);

      doesFilterSatisfy = doesFilterSatisfy && await this.conditionsChecker.doesSatisfy(product, expandedFilter);

      if (doesFilterSatisfy && !collection.automaticFillConditions.strict) {
        return true;
      }

      if (!doesFilterSatisfy && collection.automaticFillConditions.strict) {
        return false;
      }
    }

    return doesFilterSatisfy;
  }

  private isProductAddedManually(
    collection: CollectionModel,
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): boolean {
    return collection.automaticFillConditions.manualProductsList
      && collection.automaticFillConditions.manualProductsList.indexOf(product.id) !== -1;
  }
}
