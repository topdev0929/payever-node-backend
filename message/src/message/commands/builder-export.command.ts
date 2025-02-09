import { Injectable } from '@nestjs/common';
import { BusinessService, BusinessModel } from '@pe/business-kit';
import { Command } from '@pe/nest-kit';

import { BuilderProducer } from '../producers';

@Injectable()
export class BuilderExportCommand {
  constructor(
    private readonly businessService: BusinessService,
    private readonly builderProducer: BuilderProducer,
  ) { }

  @Command({
    command: 'builder:applications:export',
    describe: 'export message application',
  })
  public async exportApplications( ): Promise<void> {
    const allBusinesses: BusinessModel[] = await this.businessService.findAll();
    for (const business of allBusinesses) {
      await this.builderProducer.appExported(business);
    }
  }
}
