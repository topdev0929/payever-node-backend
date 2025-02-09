import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { ElasticSearchClient } from '@pe/elastic-kit/module';
import { ElasticIndexEnum } from '../enums';
import { SubscriptionMediaModel } from '../models';
import { SubscriptionMediaService } from '../services';

@Injectable()
export class SubscriptionMediaEsExportCommand {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly subscriptionMediaService: SubscriptionMediaService,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'subscription-media:es:export',
    describe: 'Export  subscription-media for ElasticSearch',
  })
  public async export(): Promise<void> {
    let processedMediaCount: number = 0;
    const limit: number = 100;
    let skip: number = 0;
    while (true) {
      const defaultMediaList: SubscriptionMediaModel[] = await this.subscriptionMediaService.findAll(skip, limit);

      if (!defaultMediaList.length) {
        break;
      }

      const batch: any[] = [];
      for (const media of defaultMediaList) {
        const mediaEs: any = media.toObject();
        mediaEs.attributes = mediaEs.attributes.map((attribute: any) => {
          const name: string = attribute.attribute?.name.toLowerCase();
          let value: any = attribute.value.toLowerCase();

          if (name === 'size' || name === 'version') {
            value = parseInt(value, 10);
          }

          return {
            name: name,
            value: value,
          };
        });
        batch.push({ ...mediaEs });
      }

      await this.elasticSearchClient.bulkIndex(
        ElasticIndexEnum.subscriptionMedia,
        batch,
      );

      processedMediaCount += defaultMediaList.length;
      skip += limit;
    }

    this.logger.log(processedMediaCount + ' default media items were processed');
  }
}
