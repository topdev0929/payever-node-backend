import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional, Option } from '@pe/nest-kit';
import { ProductModel } from '../models';
import { PaginationDto, SortDirectionEnum, SortDto } from '../dto';
import { ProductService } from '../services';
import { FORCE_POPULATION_TYPE } from 'src/special-types';
import { ProductsEventsProducer } from '../producers';

@Injectable()
export class ProductsExportCommand {
  constructor(
    private readonly productService: ProductService,
    private readonly productsEventsProducer: ProductsEventsProducer,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'prodcuts:export [--after]', describe: 'Export products through the bus' })
  public async productsExport(
    @Positional({
      name: 'business',
    }) businessId: string,
     @Option({
      name: 'after',
    }) after?: string,
  ): Promise<void> {
    const criteria: any = { 'channelSets.id': { $exists: false }};

    if (businessId) {
      criteria.businessId = businessId;
    }

    if (after) {
      criteria.createdAt = { };
      criteria.createdAt.$gte = new Date(after);
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
      const products: ProductModel[] =
        (await this.productService.getProductsList(
          criteria,
          pagination,
          sort,
          [],
        )) as FORCE_POPULATION_TYPE;

      if (!products.length) {
        break;
      }

      for (const product of products) {
        await this.productsEventsProducer.productExported(product);
      }
      

      processedProductsCount += products.length;
      pagination.page++;
    }

    this.logger.log(processedProductsCount + ' products was processed');
  }

}

