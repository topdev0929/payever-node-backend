import { Injectable, Logger } from '@nestjs/common';

import { Command, RabbitMqClient } from '@pe/nest-kit';
import { EmployeeService } from '../services';
import { Employee } from '../interfaces';
import { RabbitMessagesEnum } from '../enum';

@Injectable()
export class ExportEmployeesCommand {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'users:employees:export', describe: 'Export employees from Auth' })
  public async export(): Promise<void> {
    this.logger.log(`Starting exporting employees to RabbitMQ`);

    const employees: Employee[] = await this.employeeService.findBy({ });

    for (const employee of employees) {
      await this.rabbitClient.send(
        {
          channel: RabbitMessagesEnum.EmployeeExported,
          exchange: 'async_events',
        },
        {
          payload: employee,
        } as any,
        true
      );
    }

    this.logger.log(employees.length + ' employees were exported');
  }
}
