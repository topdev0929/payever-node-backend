import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';
import { Model, FilterQuery, Query, QueryCursor } from 'mongoose';
import { UserModel } from '../models';
import { UserSchemaName } from '../schemas';
import { UserEventsProducer } from '../producers';

@Injectable()
export class UserExportCommand {
  constructor(
    @InjectModel(UserSchemaName) private readonly userModel: Model<UserModel>,
    private readonly userEventProducer: UserEventsProducer,
  ) { }

  @Command({ command: 'user:export', describe: 'Export users through the bus' })
  public async userExport(
    @Option({
      name: 'find-filter',
    }) findFilterString: string,
  ): Promise<void> {

    const findFilter:  FilterQuery<UserModel> = JSON.parse(findFilterString || '{}');
    let exported: number = 0;

    const query: Query<UserModel[], UserModel> = this.userModel
      .find(findFilter);

    Logger.log({
      findFilter,
      message: `Start users export`,
    });

    const total: number = await this.userModel.countDocuments(findFilter).exec();
    Logger.log(`Found ${total} records.`);

    const fetchDocumentsCursor: QueryCursor<UserModel> = query.cursor({ batchSize: 250 });

    // tslint:disable-next-line: await-promise
    for await (const document of fetchDocumentsCursor) {
      await this.userEventProducer.produceUserExportEvent(document);
      exported++;
      Logger.log(`Exported ${exported} of ${total} records.`);
    }

  }
}
