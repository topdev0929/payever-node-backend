import { FilterQuery } from 'mongoose';

import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Get, Post, Param, Query, UseGuards } from '@nestjs/common';

import { BusinessSchemaName, BusinessModel } from '@pe/business-kit';
import {
  AccessTokenPayload,
  Roles,
  RolesEnum,
  User,
  JwtAuthGuard,
  ApplicationAccessStatusEnum,
  UserRoleInterface,
  ParamModel,
  Acl,
  AclActionsEnum,
} from '@pe/nest-kit';

import {
  UpdateApplicationAccessRequestDto,
  CreateApplicationAccessRequestDto,
  ApplicationAccessRequestDto,
} from '../dto';
import { ApplicationAccessService } from '../services';
import { UserService } from '../../users/services';
import type { UserDocument } from '../../users';
import type { CustomerRoleDocument, ApplicationAccessDocument } from '../schemas';

@ApiTags('customers')
@ApiBearerAuth()
@Controller('/api/customers/application-access')
@UseGuards(JwtAuthGuard)
export class ApplicationAccessController {
  constructor(
    private readonly roleService: ApplicationAccessService,
    private readonly userService: UserService,
  ) { }

  @ApiOperation({ description: 'Create application access request by customer' })
  @Post()
  @Roles(RolesEnum.user)
  @HttpCode(HttpStatus.OK)
  public async createApplicationAccessRequest(
    @Body() dto: CreateApplicationAccessRequestDto,
    @User() user: AccessTokenPayload,
  ): Promise<UserDocument> {
    return this.roleService.createApplicationAccessRequest(user.id, dto);
  }

  @ApiOperation({ description: 'Update application access request by application owner' })
  @Post('business/:businessId')
  @Roles(RolesEnum.merchant)
  @HttpCode(HttpStatus.OK)
  public async updateApplicationAccessRequest(
    @Body() dto: UpdateApplicationAccessRequestDto,
    @User() user: AccessTokenPayload,
    @Param('businessId') businessId: string,
  ): Promise<void> {
    return this.roleService.updateApplicationAccessRequest(
      user.id,
      businessId,
      dto,
    );
  }

  @ApiOperation({
    description: 'Get application access requests by application owner',
  })
  @ApiParam({
    name: 'users',
    required: false,
    type: [String],
  })
  @ApiParam({
    enum: ApplicationAccessStatusEnum,
    name: 'status',
    required: false,
    type: String,
  })
  @ApiResponse({ status: HttpStatus.OK, type: [ApplicationAccessRequestDto] })
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'settings', action: AclActionsEnum.read })
  @Get('business/:businessId')
  @HttpCode(HttpStatus.OK)
  public async getApplicationAccesses(
    @Query('status') status: ApplicationAccessStatusEnum,
    @Query('users') users: string[],
    @Param('businessId') businessId: string,
  ): Promise<ApplicationAccessRequestDto[]> {
    let userFilter: FilterQuery<UserDocument> = {
      [`roles.name`]: RolesEnum.customer,
      [`roles.applications.businessId`]: businessId,
    };

    if (status) {
      userFilter = {
        ...userFilter,
        [`roles.applications.status`]: status,
      };
    }

    if (users) {
      userFilter = {
        ...userFilter,
        _id: { $in: users },
      };
    }

    const usersWithApplicationAccessWithStatus: UserDocument[] = await this.userService.find(userFilter);

    return usersWithApplicationAccessWithStatus.map((user: UserDocument) => {
      //  TODO: replace by mongo aggregation
      const customerRole: CustomerRoleDocument =
        user.roles.find((role: UserRoleInterface) => role.name === RolesEnum.customer) as CustomerRoleDocument;
      const applicationAccess: ApplicationAccessDocument =
        customerRole.applications.find((app: ApplicationAccessDocument) => {
          return app.businessId === businessId && app.status === status;
        });

      return {
        ...applicationAccess.toObject(),
        userId: user._id,
      };
    });
  }
}
