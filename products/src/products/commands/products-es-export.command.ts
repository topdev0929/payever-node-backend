import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional } from '@pe/nest-kit';
import { PopulatedCollectionsCategoryVariantsProductModel, ProductModel } from '../models';
import { PaginationDto, SortDirectionEnum, SortDto } from '../dto';
import { ProductVariantModel } from '../models/product-variant.model';
import { ElasticProductEnum } from '../enums';
import { ProductService } from '../services';
import { ElasticProductConverter } from '../converters';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { FORCE_POPULATION_TYPE } from 'src/special-types';

@Injectable()
export class ProductsEsExportCommand {
  constructor(
    private readonly productService: ProductService,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  /* tslint:disable:cognitive-complexity */
  @Command({ command: 'products:es:export', describe: 'Export products for ElasticSearch' })
  public async export(
    @Positional({
      name: 'business',
    }) businessId: string,
  ): Promise<void> {
    const criteria: any = { 'channelSets.id': { $exists: false }};

    if (businessId) {
      criteria.businessId = businessId;
    }

    this.logger.log(`Criteria is ${JSON.stringify(criteria, null, 2)}.`);

    const pagination: PaginationDto = {
      limit: 100,
      page: 1,
    };
    const sort: SortDto = {
      direction: SortDirectionEnum.ASC,
      field: '_id',
    };

    let processedProductsCount: number = 0;
    while (true) {
      const products: PopulatedCollectionsCategoryVariantsProductModel[] =
        (await this.productService.getProductsList(
          criteria,
          pagination,
          sort,
          ['collections', 'category', 'variants'],
        )) as FORCE_POPULATION_TYPE;

      if (!products.length) {
        break;
      }

      const batch: Array<ProductModel | ProductVariantModel> = [];
      for (const product of products) {
        batch.push(ElasticProductConverter.productToElastic(product));

        if (product.variants) {
          const variantsBatch: any = [];
          for (const variant of product.variants) {
            if (variant) {
              variantsBatch.push(ElasticProductConverter.variantToElastic(variant));
            }
          }

          if (variantsBatch) {
            await this.elasticSearchClient.bulkIndex(
              ElasticProductEnum.index,
              variantsBatch,
              product.id,
            );
          }
        }
      }

      await this.elasticSearchClient.bulkIndex(
        ElasticProductEnum.index,
        batch,
      );

      processedProductsCount += products.length;
      pagination.page++;
    }

    this.logger.log(processedProductsCount + ' products was processed');
  }
}
