import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { Command, RabbitMqClient } from '@pe/nest-kit';
import { EmployeeService } from '../services';
import { UserService } from '../../user';
import { RabbitMessagesEnum } from '../enum';
import { EmployeeDetailSyncNameResultInterface } from '../interfaces';

@Injectable()
export class SyncEmployeeNamesCommand {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'sync:employees:names', describe: 'Sync employee names to Auth' })
  public async export(
  ): Promise<void> {
    this.logger.log(`Starting syncing employees to Auth...`);
    const userIds: string[] = await this.userService.getUsersIdsByCondition({
      'userAccount.firstName': 'undefined',
    });

    const employeeIds: string[] = await this.employeeService.getEmployeeIdsByCondition({
      userId: {
        $in: userIds,
      },
    });

    const employeesDetails: EmployeeDetailSyncNameResultInterface[] =
      await this.employeeService.getAggregatedEmployeeDetailsByConditions([
        {
          $match: {
            deleted: false,
            employeeId: {
              $in: employeeIds,
            },
          },
        },
        {
          $sort: {
            createdAt: - 1,
          },
        },
        {
          $group: {
            _id: '$employeeId',
            latestEmployeeDetail: {
              $first: '$$ROOT',
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: '$latestEmployeeDetail',
          },
        },
        {
          $lookup: {
            from: 'employees',
            localField: 'employeeId',
            foreignField: '_id',
            as: 'employeeData',
          },
        },
        {
          $unwind: '$employeeData',
        },
        {
          $addFields: {
            userId: '$employeeData.userId',
            firstName: '$firstName',
            lastName: '$lastName',
          },
        },
        {
          $project: {
            _id: 0,
            employeeId: 1,
            userId: 1,
            firstName: 1,
            lastName: 1,
          },
        },
      ]);

    for (const employeeDetail of employeesDetails) {
      await this.rabbitClient.send(
        {
          channel: RabbitMessagesEnum.EmployeeNamesSynchronized,
          exchange: 'async_events',
        },
        {
          payload: employeeDetail, 
          name: RabbitMessagesEnum.EmployeeNamesSynchronized,
        },
        true
      );
    }

    this.logger.log(employeesDetails.length + ' employees name were synced');
  }
}
