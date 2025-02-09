import { Injectable, Logger } from '@nestjs/common';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Command, Positional } from '@pe/nest-kit';
import { BusinessModel, BusinessService } from '../../business';
import { ChannelSetService } from '../services';
import { ChannelSetModel } from '../models';

@Injectable()
export class SetupBusinessChannelSetCommand {
  constructor(
    private readonly businessService: BusinessService,
    private readonly channelSetService: ChannelSetService,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'setup:new-channelset:by-type',
    describe: 'Setup ChannelSet by type',
  })
  public async setupChannelSetByType(
    @Positional({
      name: 'channelset_type',
    }) type: string,
  ): Promise<void> {
    this.logger.log(`Started setting up channel set by type - ${type}`);
    if (!type) {
      this.logger.log('Missing channelset_type param');

      return;
    }

    await this.businessService
      .findAllByBatch(100)
      .pipe(
        mergeMap((model: BusinessModel) => from(this.createChannelSetIfNotExist(model, type)), 100),
      )
      .toPromise();

    this.logger.log(`Finished setting up channel set by type - ${type}`);
  }

  private async createChannelSetIfNotExist(business: BusinessModel, type: string): Promise<void> {
    const channelSet: ChannelSetModel[] = await this.channelSetService.findByTypeAndBusiness(type, business);

    if (!channelSet || channelSet.length < 1) {
      await this.channelSetService.create({
        active: true,
        businessId: business._id,
        customPolicy: false,
        enabledByDefault: false,
        policyEnabled: true,
        type: type,
      });
    }
  }
}
