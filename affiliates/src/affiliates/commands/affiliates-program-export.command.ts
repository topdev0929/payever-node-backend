import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command } from '@pe/nest-kit/modules/command';
import { Model } from 'mongoose';
import { AffiliateProgramModel } from '../models';
import { AffiliatesMessagesProducer } from '../producers';
import { AffiliateProgramSchemaName } from '../schemas';

@Injectable()
export class AffiliatesProgramExportCommand {
  constructor(
    @InjectModel(AffiliateProgramSchemaName) private readonly affiliateProgramModel: Model<AffiliateProgramModel>,
    private readonly affiliatesMessagesProducer: AffiliatesMessagesProducer,
  ) { }

  @Command({ command: 'affiliates-program:export', describe: 'Export affiliates program through the bus' })
  public async blogExport(): Promise<void> {
    const count: number = await this.affiliateProgramModel.countDocuments({ }).exec();
    const limit: number = 100;
    let start: number = 0;
    let affiliatePrograms: AffiliateProgramModel[] = [];

    while (start < count) {
      affiliatePrograms = await this.getWithLimit(start, limit);
      start += limit;

      for (const affiliateProgram of affiliatePrograms) {
        await this.affiliatesMessagesProducer.sendAffiliateProgramExportedMessage(affiliateProgram);
      }
    }
  }

  private async getWithLimit(start: number, limit: number): Promise<AffiliateProgramModel[]> {
    return this.affiliateProgramModel.find(
      { },
      null,
      {
        limit: limit,
        skip: start,
        sort: { createdAt: 1 },
      },
    );
  }
}
