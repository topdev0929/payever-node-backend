import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserTokenInterface } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { CreateEmployeeDto } from '../dto';

import { InviteConflictResolutionEnum, RabbitMessagesEnum, Status } from '../enum';
import { Employee, Group, PositionInterface, UserModel } from '../interfaces';
import { EventsProducer } from '../producer';
import { EmployeeSchemaName, GroupsSchemaName, UserSchemaName } from '../schemas';
import { CustomAccessModel } from '../../custom-access/models';
import { EmployeeService } from './employee.service';
import { BusinessService } from '../../user/services/business.service';
import { UserService } from '../../user/services/user.service';
import { BusinessModel } from '../../user';
import { EmployeeDetail } from '../interfaces/employee-detail.interface';
import { EmployeeDetailSchemaName } from '../schemas/employee-detail.schema';

@Injectable()
export class InvitationService {
  constructor(
    private readonly eventProducer: EventsProducer,
    private readonly employeeService: EmployeeService,
    private readonly businessService: BusinessService,
    private readonly userService: UserService,
    @InjectModel(UserSchemaName) private readonly userModel: Model<UserModel>,
    @InjectModel(EmployeeSchemaName) private readonly employeeModel: Model<Employee>,
    @InjectModel(EmployeeDetailSchemaName) private readonly employeeDetailModel: Model<EmployeeDetail>,
    @InjectModel(GroupsSchemaName) private readonly groupsModel: Model<Group>,
  ) { }

  public async create(
    user: UserTokenInterface,
    dto: CreateEmployeeDto,
    businessId: string,
    shouldInvite: boolean = false,
    inviteConflictResolution?: InviteConflictResolutionEnum,
  ): Promise<Employee> {
    const business: BusinessModel = await this.businessService.findBusiness(businessId);
    const owner: UserModel = await this.userService.findById(business?.owner as string);

    if (owner && owner.userAccount?.email === dto.email) {
      throw new BadRequestException('You\'re trying to add the owner of the business as an employee, which is strictly prohibited! Please don\'t do it.');
    }

    if (user.email === dto.email) {
      throw new BadRequestException(`You\'re trying to add yourself as an employee to your own business, 
      which is strictly prohibited! Please don\'t do it.`);
    }

    const confirmEmployee: boolean = dto.confirmEmployee;
    delete dto.confirmEmployee;

    let employee: Employee = await this.employeeModel.findOne({ email: dto.email });

    if (employee) {
      for (const position of employee.positions) {
        if (position.businessId === businessId) {

          return this.handleInviteConflict(
            user,
            dto,
            businessId,
            employee,
            confirmEmployee,
            inviteConflictResolution,
          );
        }
      }
    }

    const createdBy: UserModel = await this.userModel.findOne({ _id: user.id });
    const groups: string[] = dto.groups;
    delete dto.groups;
    dto.language = createdBy ? createdBy.toObject().userAccount.language : 'en';

    const employeeId: string = employee?._id || uuid();

    const response: Array<{ success: boolean; errorMessage: string }> = await this.eventProducer.sendRPCMessage(
      {
        businessId,
        confirmEmployee,
        employee: dto,
        id: employeeId,
        shouldInvite,
        user,
      },
      RabbitMessagesEnum.RpcEmployeeCreated,
    );

    if (!response[0].success) {
      throw new BadRequestException(response[0].errorMessage);
    }

    employee = await this.updateOrCreate(employee, dto, businessId, employeeId);

    if (groups && groups.length) {
      await this.addToGroups(employee._id, groups);
    }

    return employee;
  }

  public async handleInviteConflict(
    user: UserTokenInterface,
    dto: CreateEmployeeDto,
    businessId: string,
    employee: Employee,
    confirmEmployee: boolean = false,
    inviteConflictResolution?: InviteConflictResolutionEnum,
  ): Promise<Employee> {
    if (inviteConflictResolution === InviteConflictResolutionEnum.Overwrite) {
      delete dto.fullValidation;

      return this.employeeService.update(user, businessId, employee, dto as any, false, confirmEmployee);
    }

    if (inviteConflictResolution === InviteConflictResolutionEnum.ResendInvite) {
      await this.resendInvite(employee, businessId, user);

      return employee;
    }

    if (inviteConflictResolution === InviteConflictResolutionEnum.Skip) {
      return employee;
    }

    throw new BadRequestException(
      `Email ${employee.email} already invited to business ${businessId}`,
    );
  }

  public async createByCustomAccess(
    customAccess: CustomAccessModel,
    dto: CreateEmployeeDto,
    businessId: string,
  ): Promise<Employee> {
    let employee: Employee = await this.employeeModel.findOne({ email: dto.email });
    const groups: string[] = dto.groups;
    delete dto.groups;
    dto.language = 'en';

    employee = await this.updateOrCreate(employee, dto, businessId);

    await this.eventProducer.sendMessage(
      {
        businessId,
        customAccess,
        employee: dto,
        id: employee._id,
      },
      RabbitMessagesEnum.EmployeeCreatedCustomAccess,
    );

    if (groups && groups.length) {
      await this.addToGroups(employee._id, groups);
    }

    return employee;
  }

  public async invite(employee: Employee, businessId: string): Promise<Employee> {

    return this.employeeModel.findOneAndUpdate(
      { email: employee.email, 'positions.businessId': businessId },
      {
        $set: {
          'positions.$.status': Status.invited,
        },
      },
      { new: true },
    );
  }

  public async verify(employee: Employee, businessId: string): Promise<void> {

    await this.employeeModel.findOneAndUpdate(
      { email: employee.email, 'positions.businessId': businessId },
      {
        $set: {
          'positions.$.status': Status.active,
        },
      },
      { new: true },
    );

  }

  private async resendInvite(
    employee: Employee,
    businessId: string,
    user: UserTokenInterface,
  ): Promise<void> {
    const businesssPosition: PositionInterface = employee.positions.find(
      (position: PositionInterface) => position.businessId === businessId,
    );

    if (businesssPosition && businesssPosition.status !== Status.active) {
      await this.eventProducer.sendMessage(
        {
          businessId,
          employee,
          user,
        },
        RabbitMessagesEnum.EmployeeResendInvite,
      );
    }
  }

  private async addToGroups(employeeId: string, groups: string[]): Promise<any> {
    return this.groupsModel.updateMany({ _id: { $in: groups } }, { $addToSet: { employees: employeeId } as never });
  }

  private async updateOrCreate(
    employee: Employee,
    dto: CreateEmployeeDto,
    businessId: string,
    employeeId: string = uuid(),
  ): Promise<Employee> {
    const userModel: UserModel = await this.userModel.findOne({ 'userAccount.email': dto.email });
    /* eslint-disable @typescript-eslint/naming-convention */
    const { firstName, lastName }: any = dto;
    if (employee) {
      delete dto.firstName;
      delete dto.lastName;
      employee = await this.employeeModel.findOneAndUpdate(
        { email: dto.email },
        {
          $addToSet: {
            positions: {
              businessId,
              positionType: dto.position,
              status: dto.status || Status.saved,
            } as never,
          },
          $set: {
            address: dto.address,
            companyName: dto.companyName,
            logo: dto.logo,
            phoneNumber: dto.phoneNumber,
            userId: userModel ? userModel._id : null,
          },
        },
        {
          new: true,
        },
      );
    } else {
      employee = await this.employeeModel.create({
        _id: employeeId,
        isVerified: false,
        ...dto,
        logo: dto.logo,
        positions: [
          {
            businessId,
            positionType: dto.position,
            status: dto.status || Status.saved,
          },
        ],
        roles: [],
        userId: userModel ? userModel._id : null,

      } as any);
    }

    const employeeDetail: EmployeeDetail = await this.employeeDetailModel.create({
      userId: userModel ? userModel._id : null,
      firstName,
      lastName,
      employeeId: employee._id,
      companyName: dto.companyName,
      phoneNumber: dto.phoneNumber,
      address: dto.address,
      position: {
        businessId,
        positionType: dto.position,
        status: dto.status || Status.saved,
      },
      language: dto.language,
      logo: dto.logo,
      isActive: true,
    } as EmployeeDetail);

    return this.employeeService.mergeEmployeeDetail(employee,employeeDetail);
  }
}
