import { Injectable, Logger } from '@nestjs/common';
import { QueryCursor } from 'mongoose';

import { Command, Option } from '@pe/nest-kit';

import { BusinessModel } from '../../models/business.model';
import { AppsEventsProducer } from '../producers';
import { BusinessAppsService } from '../services/business.apps.service';

@Injectable()
export class ExportBusinessAppInstallationsCommand {
  constructor(
    private readonly logger: Logger,
    private readonly businessService: BusinessAppsService,
    private readonly producer: AppsEventsProducer,
  ) { }

  @Command({
    command: 'business:export:app-installations [--uuid]',
  })
  public async run(
    @Option({
      name: 'uuid',
    }) businessId?: string,
  ): Promise<void> {
    if (businessId) {
      const business: BusinessModel = await this.businessService.findOneById(businessId);
      if (!business) {
        throw Error(`Unable to find business: ${businessId}`);
      }

      await this.processBusiness(business);
    } else {
      const businesses: QueryCursor<BusinessModel> = this.businessService
        .findAll().cursor({ batchSize: 250 });

      // tslint:disable-next-line: await-promise
      for await (const business of businesses) {
        await this.processBusiness(business);
      }
    }
    this.logger.log(`Export finished.`);
  }

  private async processBusiness(business: BusinessModel): Promise<void> {
    for (const installedApp of business.installedApps) {
      if (installedApp.installed) {
        await this.producer.produceAppInstalledEvent(installedApp, business);
      }
    }
  }
}
