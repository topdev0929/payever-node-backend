import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Positional } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { ApiCallSchemaName } from '../../mongoose-schema';
import { ApiCallModel } from '../models';
import { RabbitEventsProducer } from '../producer';
import { MessageBusEventsEnum } from '../enum';

@Injectable()
export class ApiCallsExportCommand {
  constructor(
    @InjectModel(ApiCallSchemaName) private readonly apiCallModel: Model<ApiCallModel>,
    private readonly eventsProducer: RabbitEventsProducer,
  ) { }

  @Command({ command: 'checkout:api-calls:export', describe: 'Export api calls via rabbitmq' })
  public async export(
    @Positional({
      name: 'after',
    }) after: string,
    @Positional({
      name: 'before',
    }) before: string,
  ): Promise<void> {
    const criteria: any = { };
    if (before || after) {
      criteria.createdAt = { };
    }
    if (before) {
      criteria.createdAt.$lte = new Date(before);
    }
    if (after) {
      criteria.createdAt.$gte = new Date(after);
    }

    Logger.log(`Starting api calls export`);
    Logger.log(`Criteria is ${JSON.stringify(criteria, null, 2)}.`);

    const total: number = await this.apiCallModel.countDocuments(criteria);
    Logger.log(`Found ${total} records.`);

    const limit: number = 1000;
    let processed: number = 0;

    while (processed < total) {
      const apiCallModels: ApiCallModel[] = await this.getWithLimit(processed, limit, criteria);
      let sent: number = 0;

      Logger.log(`Starting next ${apiCallModels.length} api calls.`);

      for (const apiCallModel of apiCallModels) {
        await this.eventsProducer.sendApiCallEvent(
          MessageBusEventsEnum.apiCallMigrate,
          apiCallModel,
        );
        sent++;
      }

      processed += sent;
      Logger.log(`Exported ${processed} of ${total}.`);
    }
  }

  private async getWithLimit(start: number, limit: number, criteria: any): Promise<any[]> {
    return this.apiCallModel.find(
      criteria,
      null,
      {
        limit: limit,
        skip: start,
        sort: { createdAt: 1 },
      },
    );
  }
}
