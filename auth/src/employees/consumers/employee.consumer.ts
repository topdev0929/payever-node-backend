import {
  Controller,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserTokenInterface } from '@pe/nest-kit';

import { CreateEmployeeDto, UpdateEmployeeDto } from '../dto';
import { EmployeeActivityHistoryInterface, Employee, EmployeeSyncNameInterface } from '../interfaces';
import { EmployeeService, InvitationService } from '../services';
import { RabbitMessagesEnum, MessageBusChannelsEnum } from '../../common';

@Controller()
export class EmployeeConsumer {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly invitationService: InvitationService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.EmployeeCreatedCustomAccess,
  })
  public async onEmployeeCreatedCustomAccess(
    data: {
      businessId: string;
      employee: CreateEmployeeDto;
      id: string;
    },
  ): Promise<void> {
    const employee: Employee =
      await this.invitationService.createOrUpdate(data.id, data.employee, data.businessId, true);
    await this.employeeService.confirmEmployeeInBusiness(data.businessId, employee, null);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.EmployeeNamesSynchronized,
  })
  public async onEmployeeNamesSynchronized(
    payload: EmployeeSyncNameInterface,
  ): Promise<void> {
    const employeeModel: Employee = await this.employeeService.findOneBy({ _id: payload.employeeId });
    employeeModel.firstName = payload.firstName;
    employeeModel.lastName = payload.lastName;
    await employeeModel.save();
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.EmployeeCreated,
  })
  public async onEmployeeCreated(
    data: {
      businessId: string;
      employee: CreateEmployeeDto;
      user: UserTokenInterface;
      id: string;
      shouldInvite: boolean;
      confirmEmployee: boolean;
    },
  ): Promise<void> {
    await this.invitationService.create(
      data.user,
      data.id,
      data.employee,
      data.businessId,
      data.confirmEmployee ? false : data.shouldInvite,
    );

    if (data.confirmEmployee) {
      const employee: Employee = await this.employeeService.findOneBy({ email: data.employee.email });
      await this.employeeService.confirmEmployeeInBusiness(data.businessId, employee, null);
    }
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.RpcEmployeeCreated,
  })
  public async onEmployeeRPCCreated(
    data: {
      businessId: string;
      employee: CreateEmployeeDto;
      user: UserTokenInterface;
      id: string;
      shouldInvite: boolean;
      confirmEmployee: boolean;
    },
  ): Promise<{ success: boolean; errorMessage?: string }> {
    try {
      await this.invitationService.create(
        data.user,
        data.id,
        data.employee,
        data.businessId,
        data.confirmEmployee ? false : data.shouldInvite,
      );

      if (data.confirmEmployee) {
        const employee: Employee = await this.employeeService.findOneBy({ email: data.employee.email });
        await this.employeeService.confirmEmployeeInBusiness(data.businessId, employee, null);
      }

      return { success: true};
    } catch (err) {
      return { success: false, errorMessage: err.message };
    }
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.EmployeeResendInvite,
  })
  public async onEmployeeResendInvite(
    data: {
      businessId: string;
      employee: Employee;
      user: UserTokenInterface;
    },
  ): Promise<void> {
    await this.invitationService.resendInvite(data.user, data.employee, data.businessId);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.EmployeeSyncHistory,
  })
  public async onEmployeeSyncHistory (
    data: {
      employeeActivityHistory: EmployeeActivityHistoryInterface;
    },
  ): Promise<void> {
    await this.employeeService.recordEmployeeActivityHistory(data.employeeActivityHistory);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.EmployeeUpdatedCustomAccess,
  })
  public async onEmployeeUpdateCustomAccess(
    data: {
      businessId: string;
      employee: Employee;
      dto: UpdateEmployeeDto;
    },
  ): Promise<void> {
    let employee: Employee = await this.employeeService.findOneBy({ _id: data.employee._id });
    if (!employee) {
      return;
    }

    employee = await this.employeeService.updateEmployee(data.employee, data.dto, data.businessId);
    await this.employeeService.confirmEmployeeInBusiness(data.businessId, employee, null);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.EmployeeUpdated,
  })
  public async onEmployeeUpdate(
    data: {
      businessId: string;
      employee: Employee;
      dto: UpdateEmployeeDto;
      confirmEmployee: boolean;
    },
  ): Promise<void> {
    const employee: Employee = await this.employeeService.findOneBy({ _id: data.employee._id });
    if (!employee) {
      return;
    }

    await this.employeeService.updateEmployee(data.employee, data.dto, data.businessId);
    if (data.confirmEmployee) {
      await this.employeeService.confirmEmployeeInBusiness(data.businessId, employee, null);
    }
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.EmployeeRemoved,
  })
  public async onEmployeeDelete(
    data: {
      businessId?: string;
      employee: Employee;
    },
  ): Promise<void> {
    const employee: Employee = await this.employeeService.findOneBy({ _id: data.employee.id });
    if (!employee) {
      return;
    }

    if (data.businessId) {
      EmployeeService.checkAccess(data.employee, data.businessId);

      await this.employeeService.removeEmployeeFromBusiness(data.employee, data.businessId);
    } else {
      await this.employeeService.deleteEmployee(data.employee);
    }
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.EmployeeExported,
  })
  public async onEmployeeExport(
    employee: any,
  ): Promise<void> {
    const employeeData: Employee = await this.employeeService.findOneBy({ _id: employee._id });
    if (!employeeData) {
      delete employee.companyName;
      delete employee.phoneNumber;
      delete employee.address;
      delete employee.userId;

      await this.employeeService.insert(employee);

      return;
    }

    await this.employeeService.update(employeeData, employee);
  }
}
