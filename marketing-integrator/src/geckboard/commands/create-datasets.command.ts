import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { GeckoboardDatasetService } from '../services';
import { DatasetSchemas } from '../dataset-schemas';

@Injectable()
export class CreateDatasetsCommand {
  constructor(
    private readonly geckoboardDatasetService: GeckoboardDatasetService,
    private readonly logger: Logger,
  ) {
  }

  @Command({
    command: 'geckoboard:dataset:create',
    describe: 'Creates or updates Geckoboard datasets (existing datasets won\'t loose data records)',
  })
  public async run(): Promise<void> {
    for (const k in DatasetSchemas) {
      if (DatasetSchemas.hasOwnProperty(k)) {
        await this.geckoboardDatasetService.createDataset(k, DatasetSchemas[k]);
        this.logger.log(`Created dataset "${k}"`);
      }
    }
  }
}
