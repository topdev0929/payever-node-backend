import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional } from '@pe/nest-kit';
import { GeckoboardDatasetService } from '../services';

@Injectable()
export class DeleteDatasetCommand {
  constructor(
    private readonly geckoboardDatasetService: GeckoboardDatasetService,
    private readonly logger: Logger,
  ) {
  }

  @Command({
    command: 'geckoboard:dataset:delete',
    describe: 'Deletes Geckoboard dataset by name',
  })
  public async run(
    @Positional({ name: 'name' }) datasetName: string,
  ): Promise<void> {
    await this.geckoboardDatasetService.deleteDataset(datasetName);
    this.logger.log(`Dataset ${datasetName} successfully removed`);
  }
}
