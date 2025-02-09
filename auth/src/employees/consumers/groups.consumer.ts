import {
  Controller,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserService } from '../../users/services';
import { AddGroupDto, PatchGroupDto, EmployeesDto } from '../dto';
import { Employee, Group } from '../interfaces';
import { GroupsSchemaName } from '../schemas';
import { EmployeeService } from '../services';
import { defaultAcls, defaultCommercesOsGroup } from '../constants/defaults';
import { RabbitMessagesEnum, MessageBusChannelsEnum } from '../../common';

@Controller()
export class GroupsConsumer {
  constructor(
    @InjectModel(GroupsSchemaName) private readonly groupsModel: Model<Group>,
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.GroupCreated,
  })
  public async onGroupCreated(
    data: {
      businessId: string;
      id: string;
      dto: AddGroupDto;
    },
  ): Promise<void> {

    const group: Group = await this.groupsModel.findOne({ _id: data.id });

    if (group) {
      return;
    }
    
    await this.groupsModel.create({
      _id: data.id,
      businessId: data.businessId,
      ...data.dto,
    });
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.GroupUpdated,
  })
  public async onGroupUpdate(
    data: {
      businessId: string;
      originalGroup: Group;
      dto: PatchGroupDto;
    },
  ): Promise<void> {
    const group: Group = await this.groupsModel.findOne({ _id: data.originalGroup._id }).exec();
    if (!group) {
      return;
    }
    const updatedGroup: Group = await this.groupsModel.findOneAndUpdate(
      { _id: group._id },
      {
        $set: {
          ...data.dto,
        },
      },
      { new: true },
    ).exec();
    if (data.dto.acls?.length) {
      const employeeIds: string[] = group.employees as string[];
      for (const id of employeeIds) {
        const employee: Employee = await this.employeeService.findOneBy({ _id: id });
        await this.employeeService.updatePermissions(employee, updatedGroup.businessId, true);
      }
    }
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.GroupRemoved,
  })
  public async onGroupDelete(
    data: {
      businessId: string;
      group: Group;
    },
  ): Promise<void> {
    const group: Group = await this.groupsModel.findOne({ _id: data.group._id }).exec();
    if (!group) {
      return;
    }
    const plainGroup: Group = group.toObject();
    for (const employeeId of group.employees as string[]) {
      await this.employeeService.removeEmployeeFromGroup(employeeId, data.businessId, plainGroup.acls);
    }

    await group.remove();
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.GroupAddEmployee,
  })
  public async onAddToGroup(
    data: {
      businessId: string;
      group: Group;
      employees: EmployeesDto;
    },
  ): Promise<void> {
    const group: Group = await this.groupsModel.findOne({ _id: data.group._id }).exec();
    if (!group) {
      return;
    }

    await this.groupsModel.findOneAndUpdate(
      { _id: group._id },
      { $addToSet: { employees: { $each: data.employees.employees as never} as never } },
      { new: true },
    ).exec();

    for (const uuid of data.employees.employees) {
      const employee: Employee = await this.employeeService.findOneBy({ _id: uuid });
      if (!employee) {
        continue;
      }      
      await this.employeeService.updatePermissions(employee, group.businessId, true);
    }
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.GroupRemovedEmployee,
  })
  public async onRemoveFromGroup(
    data: {
      businessId: string;
      group: Group;
      employees: EmployeesDto;
    },
  ): Promise<void> {
    const group: Group = await this.groupsModel.findOne({ _id: data.group._id }).exec();
    if (!group) {
      return;
    }
    await this.groupsModel.findByIdAndUpdate(
      group._id,
      { $pull: { employees: { $in: data.employees.employees } as never } },
      { new: true },
    ).exec();

    for (const uuid of data.employees.employees) {
      const employee: Employee = await this.employeeService.findOneBy({ _id: uuid });
      if (!employee) {
        continue;
      }      
      await this.employeeService.updatePermissions(employee, group.businessId, true);
    }
  }
}
