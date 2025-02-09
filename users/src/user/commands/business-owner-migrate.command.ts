import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { BusinessModel } from '../models';
import { BusinessEventsProducer } from '../producers';
import { BusinessSchemaName } from '../schemas';

@Injectable()
export class BusinessOwnerMigrateCommand {
  constructor(
    @InjectModel(BusinessSchemaName)
    private readonly businessModel: Model<BusinessModel>,
    private readonly businessEventsProducer: BusinessEventsProducer,
  ) { }

  @Command({
    command: 'business:owner-migrate [--uuid]',
    describe: 'Migrate business Owner through the bus',
  })
  public async businessOwnerMigrate(
    @Option({
      name: 'uuid',
    })
    uuid: string,
  ): Promise<void> {
    if (uuid) {
      const business: BusinessModel = await this.businessModel.findById(uuid);
      if (!business) {
        throw Error(`Unable to find business: ${uuid}`);
      }

      await this.sendEvent(business);
    } else {
      const count: number = await this.businessModel.countDocuments({ }).exec();
      const limit: number = 10;
      let start: number = 0;
      let businesses: BusinessModel[] = [];

      while (start < count) {
        businesses = await this.getWithLimit(start, limit);
        start += limit;

        for (const business of businesses) {
          await this.sendEvent(business);
        }
      }
    }
  }

  private async getWithLimit(
    start: number,
    limit: number,
  ): Promise<BusinessModel[]> {
    return this.businessModel.find({ }, null, {
      limit: limit,
      skip: start,
      sort: { createdAt: 1 },
    });
  }

  private async sendEvent(business: BusinessModel): Promise<void> {
    return this.businessEventsProducer.produceBusinessOwnerMigrateEvent(business);
  }
}
