import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional } from '@pe/nest-kit';
import { CollectionModel } from '../models';
import { CollectionsService } from '../services';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { PaginationDto, SortDirectionEnum, SortDto } from '../../products/dto';
import { ElasticIndexEnum } from '../enums';

@Injectable()
export class CollectionsEsExportCommand {
  constructor(
    private readonly collectionService: CollectionsService,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  /* tslint:disable:cognitive-complexity */
  @Command({ command: 'collections:es:export', describe: 'Export collections for ElasticSearch' })
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

    let processedCollectionsCount: number = 0;
    while (true) {
      const collections: CollectionModel[] =
        await this.collectionService.getByQuery(
          criteria,
          pagination,
          sort,
        );

      if (!collections.length) {
        break;
      }

      const batch: any[] = [];
      for (const collection of collections) {
        batch.push(collection.toObject());
      }

      await this.elasticSearchClient.bulkIndex(
        ElasticIndexEnum.collectionIndex,
        batch,
      );

      processedCollectionsCount += collections.length;
      pagination.page++;
    }

    this.logger.log(processedCollectionsCount + ' collections was processed');
  }
}
