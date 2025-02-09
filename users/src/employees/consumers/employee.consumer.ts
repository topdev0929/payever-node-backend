import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MessageBusChannelsEnum } from '../../user/enums';
import { EmployeeConfirmation } from '../dto/employees/confirmation';
import { RabbitMessagesEnum } from '../enum';
import { Employee, EmployeeDetailSyncNameResultInterface } from '../interfaces';
import { EmployeeService, GroupsService, InvitationService } from '../services';

@Controller()
export class EmployeeConsumer {
  constructor(
    private readonly inviteService: InvitationService,
    private readonly employeeService: EmployeeService,
    private readonly groupsService: GroupsService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: RabbitMessagesEnum.EmployeeConfirm,
  })
  public async onEmployeeConfirm(
      data: {
        confirmation: EmployeeConfirmation;
        employee: Employee;
      },
    ): Promise<void> {

    await this.employeeService.confirmEmployee(data.confirmation, data.employee);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: RabbitMessagesEnum.EmployeeConfirmInBusiness,
  })
  public async onEmployeeConfirmInBusiness(
      data: {
        businessId: string;
        employee: Employee;
      },
    ): Promise<void> {

    await this.employeeService.confirmEmployeeInBusiness(data.businessId, data.employee);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: RabbitMessagesEnum.EmployeeInvite,
  })
  public async onEmployeeInvite(
    data: {
      businessId: string;
      employee: Employee;
    },
  ): Promise<void> {
    if (!data.employee || !data.businessId) {
      return;
    }

    await this.inviteService.invite(data.employee, data.businessId);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: RabbitMessagesEnum.EmployeeVerify,
  })
  public async onEmployeeVerify(
      data: {
        businessId: string;
        employee: Employee;
      },
    ): Promise<void> {

    if (!data.employee || !data.businessId) {
      return;
    }

    await this.inviteService.verify(data.employee, data.businessId);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: RabbitMessagesEnum.EmployeeRegister,
  })
  public async onEmployeeRegistered(
    data: {
      employee: any;
      groups: string[];
    },
  ): Promise<void> {

    delete data.employee.acls;
    delete data.employee.roles;
    
    await this.employeeService.upsert(data.employee);

    const groups: string[] = data.groups;

    if (groups && groups.length) {
      await this.groupsService.addToGroups(data.employee._id, groups);
    }
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: RabbitMessagesEnum.EmployeeMigrate,
  })
  public async onEmployeeMigrate(
      employee: any,
  ): Promise<void> {
    try {
      delete employee.acls;
      delete employee.roles;
      
      await this.employeeService.upsert(employee);
    } catch (e) { }
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: RabbitMessagesEnum.EmployeeNamesSynchronized,
  })
  public async onEmployeeNamesSynced(payload: EmployeeDetailSyncNameResultInterface): Promise<void> {
    const employeeModel: Employee = await this.employeeService.findOneBy({ _id: payload.employeeId });
    employeeModel.firstName = payload.firstName;
    employeeModel.lastName = payload.lastName;
    await employeeModel.save();
  }
}
