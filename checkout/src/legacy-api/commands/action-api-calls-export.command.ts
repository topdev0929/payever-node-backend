import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Positional } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { ActionApiCallSchemaName } from '../../mongoose-schema';
import { MessageBusEventsEnum } from '../enum';
import { ActionApiCallModel } from '../models';
import { LegacyApiEventsProducer } from '../producer';

@Injectable()
export class ActionApiCallsExportCommand {
  constructor(
    @InjectModel(ActionApiCallSchemaName) private readonly actionApiCallModel: Model<ActionApiCallModel>,
    private readonly eventsProducer: LegacyApiEventsProducer,
  ) { }

  @Command({ command: 'checkout:action-api-calls:export', describe: 'Export action api calls via rabbitmq' })
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

    Logger.log(`Starting action api calls export`);
    Logger.log(`Criteria is ${JSON.stringify(criteria, null, 2)}.`);

    const total: number = await this.actionApiCallModel.countDocuments(criteria);
    Logger.log(`Found ${total} records.`);

    const limit: number = 1000;
    let processed: number = 0;

    while (processed < total) {
      const actionApiCallModels: ActionApiCallModel[] = await this.getWithLimit(processed, limit, criteria);
      let sent: number = 0;

      Logger.log(`Starting next ${actionApiCallModels.length} api calls.`);

      for (const actionApiCallModel of actionApiCallModels) {
        await this.eventsProducer.sendActionApiCallEvent(
          MessageBusEventsEnum.actionApiCallMigrate,
          actionApiCallModel,
        );
        sent++;
      }

      processed += sent;
      Logger.log(`Exported ${processed} of ${total}.`);
    }
  }

  private async getWithLimit(start: number, limit: number, criteria: any): Promise<ActionApiCallModel[]> {
    return this.actionApiCallModel.find(
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
