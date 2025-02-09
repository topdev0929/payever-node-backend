import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Command } from '@pe/nest-kit';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { ElasticUserEnum } from '../enums';
import { UserModel } from '../models';
import { UserSchemaName, User } from '../schemas';

@Injectable()
export class UserEsExportCommand {
  constructor(
    @InjectModel(UserSchemaName) private readonly userModel: Model<UserModel>,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  /* tslint:disable:cognitive-complexity array-type */
  @Command({ command: 'users:es:export', describe: 'Export users for ElasticSearch' })
  public async export(): Promise<void> {
    let page: number = 0;
    const limit: number = 100;

    let processedUsersCount: number = 0;
    while (true) {
      const skip: number = page * limit;

      const users: UserModel[] =
        await this.userModel.find({ }).sort([['createdAt', 1]]).limit(limit).skip(skip);

      if (!users.length) {
        break;
      }

      const batch: User[] = [];
      for (const user of users) {
        batch.push({
          ...user.toObject(),
        });
      }

      await this.elasticSearchClient.bulkIndex(
        ElasticUserEnum.index,
        batch,
      );

      processedUsersCount += users.length;
      page++;
    }

    this.logger.log(processedUsersCount + ' users was processed');
  }
}
