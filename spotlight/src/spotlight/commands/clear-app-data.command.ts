import { Injectable, Logger } from '@nestjs/common';
import { Command, Option } from '@pe/nest-kit';
import { AppEnum } from '../enums';
import { SpotlightService } from '../services';

@Injectable()
export class SpotlightClearAppDataCommand {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @Command({
    command: 'spotlight:clear:app-data',
    describe: 'Clear app data',
  })
  public async clearData(
    @Option({
      name: 'app',
      type: 'string',
    }) app: AppEnum,
  ): Promise<void> {
    if (!app) {
      return;
    }

    await this.spotlightService.deleteAppData(app);
    Logger.log(`Data for ${app} removed`);
  }
}
