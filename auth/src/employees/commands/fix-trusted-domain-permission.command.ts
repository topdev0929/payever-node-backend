import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Command, PermissionInterface } from '@pe/nest-kit';
import { EmployeeService, GroupsService } from '../services';
import { Employee, Group } from '../interfaces';
import { EmployeeSchemaName } from '../schemas';

@Injectable()
export class FixTrustedDomainEmployeesPermissionCommand {
  constructor(
    @InjectModel(EmployeeSchemaName) private readonly employeeModel: Model<Employee>,
    private readonly employeeService: EmployeeService,
    private readonly groupsService: GroupsService,
    private readonly logger: Logger,
  ) { }

  @Command({ 
    command: 'fix:trusted-domain:employee:permissions', 
    describe: 'Fix trusted domain employee permissions',
  })
  public async migrate(): Promise<void> {
    const groups: Group[] = await this.groupsService.getAllTrustedDomainGroups();

    for (const group of groups) {

      if (!group.employees) {
        continue;
      }

      for (const employeeId of group.employees) {
        const employee: Employee = await this.employeeModel.findOne({ _id: employeeId as string });
        if (!employee) {
          continue;
        }
        await this.fixEmployeePermission(employee, group.businessId);       
      }
    }
  }

  private async fixEmployeePermission(employee: Employee, businessId: string): Promise<void> {
    const businessPermission: PermissionInterface = employee.permissions.find(
      (permission: PermissionInterface) => permission.businessId === businessId,
    );

    if (!businessPermission) {
      return;
    }

    employee = await this.employeeModel.findOneAndUpdate(
      { _id: employee.id, 'permissions.businessId': businessId },
      {
        $set: {
          'permissions.$[].acls': [],
        },
      },
      { 
        new: true,
      },
    ).exec();

    await this.employeeService.updatePermissions(employee, businessId, true);
  }
}
