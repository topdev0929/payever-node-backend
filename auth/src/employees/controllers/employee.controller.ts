import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LeanDocument } from 'mongoose';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Acl,
  AclActionsEnum,
  AclInterface,
  JwtAuthGuard,
  ParamModel,
  PermissionInterface,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
} from '@pe/nest-kit';

import { EmployeeSchemaName, GroupsSchemaName } from '../schemas';
import { Employee, EmployeeSettings, Group, PositionInterface } from '../interfaces';
import { INVALID_CREDENTIALS_MESSAGE } from '../constants/errors';
import { CreateEmployeeDto } from '../dto';
import { EmployeeService, InvitationService } from '../services';
import { EmployeeSettingsService } from '../services/employee-settings.service';
import { Status } from '../enum';
import { BusinessSchemaName } from '@pe/business-kit';
import { BusinessLocalDocument } from '../../business/schemas';

@Controller('api/employees')
@ApiTags('employees')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.anonymous)
export class EmployeeController {
  constructor(
    private readonly invitationService: InvitationService,
    private readonly employeeService: EmployeeService,
    private readonly employeeSettingsService: EmployeeSettingsService,
  ) { }

  @Post('business/:businessId/employee/settings')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee Expiry created' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.create})
  public async updateExpiryHours(
    @Param('businessId') businessId: string,
    @Body() dto: { expiryHours: number },
  ): Promise<EmployeeSettings> {
    return this.employeeSettingsService.upsertEmployeeSettings(businessId, dto.expiryHours);
  }

  @Post('business/:businessId/employee/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee created' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.create})
  public async create(
    @User() user: UserTokenInterface,
    @Param('id') id: string,
    @Param('businessId') businessId: string,
    @Body() dto: CreateEmployeeDto,
  ): Promise<Employee> {
    return this.invitationService.create(user, id, dto, businessId, true);
  }

  @Get('business/:businessId/get-acls/:id')
  @HttpCode(HttpStatus.OK)
  public async getAcls(
    @ParamModel(':id', EmployeeSchemaName, true) employee: Employee,
    @Param('businessId') businessId: string,
  ): Promise<{ acls: AclInterface[]; positions: PositionInterface[] }> {
    const data: LeanDocument<Employee> = employee.toObject();
    const businessAcls: AclInterface[] = await this.employeeService.getBusinessAcls(businessId, employee.userId);
    const employeePermission: PermissionInterface = data.permissions.find(
      (permission: PermissionInterface) => permission.businessId === businessId,
    );

    return {
      acls:  businessAcls.length ? businessAcls : employeePermission.acls || [],
      positions: data.positions,
    };
  }

  @Get('business/:businessId/get-acls-by-user/:userId')
  @HttpCode(HttpStatus.OK)
  public async getAclsByUser(
    @Param('userId') userId: string,
    @Param('businessId') businessId: string,
  ): Promise<{ acls: AclInterface[]; employee: LeanDocument<Employee> }> {
    const employee: Employee = await this.employeeService.findOneBy({ userId });
    if (!employee) {
      throw new NotFoundException(`Employee not found`);
    }
    const data: LeanDocument<Employee> = employee.toObject();

    const businessAcls: AclInterface[] = await this.employeeService.getBusinessAcls(businessId, userId);
    const employeePermission: PermissionInterface = data.permissions.find(
      (permission: PermissionInterface) => permission.businessId === businessId,
    );

    return {
      acls:  businessAcls.length ? businessAcls : employeePermission.acls || [],
      employee: data,
    };
  }

  @Get('business/:businessId/need-approval')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'settings', action: AclActionsEnum.read})
  public async needApprovalEmployee(
    @Param('businessId') businessId: string,
  ): Promise<Employee[]> {
   return this.employeeService.findBy({
      positions: { $elemMatch: { status: Status.needApproval, businessId } } },
    );
  }

  @Patch('business/:businessId/approve/employee/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'settings', action: AclActionsEnum.update})
  public async approveEmployee(
    @User() user: UserTokenInterface,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessLocalDocument,
    @ParamModel(':id', EmployeeSchemaName, true) employee: Employee,
  ): Promise<void> {
   return this.invitationService.approveEmployee(user, employee, business);
  }

  @Patch('business/:businessId/reject/employee/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'settings', action: AclActionsEnum.update})
  public async rejectEmployee(
    @User() user: UserTokenInterface,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessLocalDocument,
    @ParamModel(':id', EmployeeSchemaName, true) employee: Employee,
  ): Promise<void> {
    return this.invitationService.rejectEmployee(user, employee, business);
  }

  @Get('/groups/get-acls/:id')
  @HttpCode(HttpStatus.OK)
  public async getGroupAcls(
    @ParamModel(':id', GroupsSchemaName, true) group: Group,
  ): Promise<AclInterface[]> {
    return group.toObject().acls;
  }
}
