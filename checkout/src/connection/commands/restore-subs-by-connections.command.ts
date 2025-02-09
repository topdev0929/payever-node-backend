import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, EventDispatcher, Option } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { ConnectionSchemaName } from '../../mongoose-schema';
import { ConnectionEvent } from '../enums';
import { ConnectionModel } from '../models';

@Injectable()
export class RestoreSubsByConnectionsCommand {
  constructor(
    @InjectModel(ConnectionSchemaName) private readonly connectionModel: Model<ConnectionModel>,
    private eventDispatcher: EventDispatcher,
  ) { }

  @Command({
    command: 'subs:restore-from-connection',
    describe: 'Restore business integration subscriptions by connections.',
  })
  public async export(
    @Option({ name: 'business' }) business_id: string | undefined,
  ): Promise<void> {
    const criteria: any = { };
    if (business_id) {
      criteria.business = business_id;
    }

    const total: number = await this.connectionModel.countDocuments(criteria);
    const limit: number = 100;
    let processed: number = 0;

    while (processed < total) {
      const connections: ConnectionModel[] = await this.getWithLimit(processed, limit, criteria);
      Logger.log(`Starting next ${connections.length} connections.`);

      const tasks: Array<Promise<any>> = [];
      for (const connection of connections) {
        if (connection.business === null) {
          tasks.push(connection.remove());
          continue;
        }

        if (connection.isBpoActive === false) {
          tasks.push(this.eventDispatcher.dispatch(
            ConnectionEvent.ConnectionRemoved,
            connection.business,
            connection.integration,
            connection,
          ));
        } else {
          tasks.push(this.eventDispatcher.dispatch(
            ConnectionEvent.ConnectionCreated,
            connection.business,
            connection.integration,
            connection,
          ));
        }
      }

      await Promise.all(tasks);

      processed += connections.length;
      Logger.log(`Processed ${processed} of ${total}.`);
    }
  }

  private async getWithLimit(start: number, limit: number, criteria: any = { }): Promise<ConnectionModel[]> {
    return this.connectionModel
      .find(
        criteria,
        null,
        {
          limit: limit,
          skip: start,
          sort: { _id: 1 },
        },
      )
      .populate('business')
      .populate('integration')
    ;
  }
}
