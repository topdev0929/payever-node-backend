import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, FilterQuery, Query, QueryCursor } from 'mongoose';

import { Command, RabbitMqClient, Option } from '@pe/nest-kit';
import { RabbitMessagesEnum } from '../../common';
import { Employee } from '../interfaces';
import { EmployeeSchemaName } from '../schemas';

@Injectable()
export class MigrateEmployeesCommand {
  constructor(
    @InjectModel(EmployeeSchemaName) private readonly employeeModel: Model<Employee>,
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'auth:employees:migrate', describe: 'Migrate employees from Auth' })
  public async migrate(
    @Option({
      name: 'find-filter',
    }) findFilterString: string,
  ): Promise<void> {
    const findFilter: FilterQuery<Employee> = JSON.parse(findFilterString || '{}');
    let exported: number = 0;

    const query: Query<Employee[], Employee> = this.employeeModel
      .find(findFilter);

    this.logger.log({
      findFilter,
      message: `Start employee export`,
    });

    const total: number = await this.employeeModel.countDocuments(findFilter).exec();
    this.logger.log(`Found ${total} records.`);

    const fetchDocumentsCursor: QueryCursor<Employee> = query.cursor({ batchSize: 250 });

    // tslint:disable-next-line: await-promise
    for await (const document of fetchDocumentsCursor) {
      await this.rabbitClient.send(
        {
          channel: RabbitMessagesEnum.EmployeeMigrate,
          exchange: 'async_events',
        },
        {
          name: RabbitMessagesEnum.EmployeeMigrate,
          payload: document,
        },
        true,
      );
      exported++;
      this.logger.log(`Exported ${exported} of ${total} records.`);
    }
  }
}
