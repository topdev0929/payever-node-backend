import { QueryCursor } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { BusinessService } from '@pe/business-kit';

import { WidgetInstallationService } from '../../widget/services';
import { BusinessModel } from '../models';

@Injectable()
export class InstallAppCommand {
  constructor(
    private readonly businessService: BusinessService<BusinessModel>,
    private readonly widgetInstallationService: WidgetInstallationService,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'add:widgets-installations',
    describe: 'create WidgetInstallations of widgets if it already does not exist',
  })
  public async addMissingWidgetsInstallations(): Promise<void> {
    this.logger.log('adding widgetinstallations for new widget for existing business');
    const businesses: QueryCursor<BusinessModel> = this.businessService
      .findAll().cursor({ batchSize: 250 });
    // tslint:disable-next-line: await-promise
    for await (const business of businesses) {
      await this.widgetInstallationService.installWidgetsToBusiness(business);
    }
  }
}
