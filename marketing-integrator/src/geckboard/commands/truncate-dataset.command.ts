import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional } from '@pe/nest-kit';
import { GeckoboardDatasetService } from '../services';

@Injectable()
export class TruncateDatasetCommand {
  constructor(
    private readonly geckoboardDatasetService: GeckoboardDatasetService,
    private readonly logger: Logger,
  ) {
  }

  @Command({
    command: 'geckoboard:dataset:truncate',
    describe: 'Removes all Geckoboard dataset records by name',
  })
  public async run(
    @Positional({ name: 'name' }) datasetName: string,
  ): Promise<void> {
    await this.geckoboardDatasetService.clearDatasetRecords(datasetName);
    this.logger.log(`Dataset ${datasetName} successfully truncated`);
  }
}
