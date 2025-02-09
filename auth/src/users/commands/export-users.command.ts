import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';
import { Model, FilterQuery, Query, QueryCursor } from 'mongoose';

import { UserModel } from '../models';
import { UserEventProducer } from '../producer';

@Injectable()
export class ExportUsersCommand {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserModel>,
    private readonly userEventProducer: UserEventProducer,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'auth:users:export', describe: 'Export users from Auth' })
  public async export(
    @Option({
      name: 'find-filter',
    }) findFilterString: string,
  ): Promise<void> {
    const findFilter:  FilterQuery<UserModel> = JSON.parse(findFilterString || '{}');
    let exported: number = 0;

    const query: Query<UserModel[], UserModel> = this.userModel
      .find(findFilter);

    this.logger.log({
      findFilter,
      message: `Start users export`,
    });

    const total: number = await this.userModel.countDocuments(findFilter).exec();
    this.logger.log(`Found ${total} records.`);

    const fetchDocumentsCursor: QueryCursor<UserModel> = query.cursor({ batchSize: 250 });


    // tslint:disable-next-line: await-promise
    for await (const document of fetchDocumentsCursor) {
      await this.userEventProducer.produceUserExportedEvent(document);
      exported++;
      this.logger.log(`Exported ${exported} of ${total} records.`);
    }
  }
}
