import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional } from '@pe/nest-kit';
import { CategoryModel } from '../models';
import { CategoryService } from '../services';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { PaginationDto, SortDirectionEnum, SortDto } from '../../products/dto';
import { ElasticIndexEnum } from '../enums';

@Injectable()
export class CategoriesEsExportCommand {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  /* tslint:disable:cognitive-complexity */
  @Command({ command: 'categories:es:export', describe: 'Export categories for ElasticSearch' })
  public async export(
    @Positional({
      name: 'business',
    }) businessId: string,
  ): Promise<void> {
    const criteria: any = { };

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

    let processedCategoriesCount: number = 0;
    while (true) {
      const categories: CategoryModel[] =
        await this.categoryService.getByQuery(
          criteria,
          pagination,
          sort,
        );

      if (!categories.length) {
        break;
      }

      const batch: any[] = [];
      for (const category of categories) {
        batch.push(category.toObject());
      }

      await this.elasticSearchClient.bulkIndex(
        ElasticIndexEnum.categoryIndex,
        batch,
      );

      processedCategoriesCount += categories.length;
      pagination.page++;
    }

    this.logger.log(processedCategoriesCount + ' categories was processed');
  }
}
