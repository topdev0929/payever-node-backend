import { Command, RabbitMqClient, Option } from '@pe/nest-kit';
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { BusinessModel, businessModel as bm } from '../models/business.model';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BusinessExportCommand {
  constructor(
    @InjectModel(bm.modelName) private readonly businessModel: Model<BusinessModel>,
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }

  @Command({
    aliases: 'Export business',
    command: 'export:business [--businessId]',
  })
  public async run(
    @Option({
      name: 'businessId',
    }) businessId: string,
  ): Promise<void> {

    if (businessId) {
      const business: BusinessModel = await this.businessModel.findById(businessId);
      if (!business) {
        throw Error(`Unable to find business: ${businessId}`);
      }

      await this.sendEvent(business);
    } else {
      const count: number = await this.businessModel.countDocuments({ }).exec();
      const limit: number = 10;
      let start: number = 0;
      let businesses: BusinessModel[] = [];

      this.logger.log('processing 10 businesss');

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
    });
  }

  private async sendEvent(business: BusinessModel): Promise<void> {
    return this.rabbitClient.send(
      {
        channel: 'commerceos.event.business.export',
        exchange: 'async_events',
      },
      {
        name: 'commerceos.event.business.export',
        payload: {
          business,
        },
      },
    );
  }
}
