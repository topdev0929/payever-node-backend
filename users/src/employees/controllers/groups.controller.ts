import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
} from '@pe/nest-kit';
import { Model } from 'mongoose';
import { AddGroupDto, PatchGroupDto, EmployeesDto } from '../dto';
import { Group } from '../interfaces';
import { GroupsSchemaName } from '../schemas';
import { GROUP_NOT_FOUND, INVALID_CREDENTIALS_MESSAGE } from '../constants/errors';
import { GroupListingDto } from '../dto/group-listing.dto';
import { EmployeeService, GroupsService } from '../services';
import { InfoTransformPipe } from '../pipes';

@Controller('/employee-groups/:businessId')
@ApiBearerAuth()
@ApiTags('employees')
@UsePipes(InfoTransformPipe)
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
export class GroupsController {
  constructor(
    @InjectModel(GroupsSchemaName) private readonly groupsModel: Model<Group>,
    private readonly employeeService: EmployeeService,
    private readonly groupService: GroupsService,
  ) { }

  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Group created' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.create})
  public async add(@Param('businessId') businessId: string, @Body() dto: AddGroupDto): Promise<Group> {
    
    return this.groupService.create(dto, businessId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Group edited' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.update})
  public async patch(
    @Param('businessId') businessId: string,
    @ParamModel(':id', GroupsSchemaName, true) group: Group,
    @Body() dto: PatchGroupDto,
  ): Promise<Group> {
    if (group.businessId !== businessId) {
      throw new NotFoundException(GROUP_NOT_FOUND);
    }

    return this.groupService.update(group, dto, businessId);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of groups returned' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.read})
  public async list(
    @Param('businessId') businessId: string,
    @Query() groupListingDto: GroupListingDto,
  ): Promise<{ data: Group[]; count: number }> {

    return this.groupService.getList(businessId, groupListingDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Single group returned' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.read})
  public async get(
    @Param('businessId') businessId: string,
    @ParamModel(':id', GroupsSchemaName, true) group: Group,
  ): Promise<Group> {
    if (group.businessId !== businessId) {
      throw new NotFoundException(GROUP_NOT_FOUND);
    }

    return this.employeeService.populateEmployeesInGroup(group, businessId);
  }

  @Get('/count')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Count groups by name in business' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.read})
  public async countGroups(
    @Param('businessId') businessId: string,
    @Query('groupName') groupName: string | RegExp,
  ): Promise<number> {
    groupName = new RegExp(`^${groupName}$`, 'i');

    return this.groupsModel.countDocuments({ businessId, name: groupName });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Group removed' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.delete})
  public async delete(
    @Param('businessId') businessId: string,
    @ParamModel(':id', GroupsSchemaName, true) group: Group,
  ): Promise<Group> {
    if (group.businessId !== businessId) {
      throw new NotFoundException(GROUP_NOT_FOUND);
    }

    return this.groupService.remove(group, businessId);
  }

  @Post(':groupId/add-employees')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'User added to group' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.update})
  public async addToGroup(
    @Param('businessId') businessId: string,
    @ParamModel(':groupId', GroupsSchemaName, true) group: Group,
    @Body() employees: EmployeesDto,
  ): Promise<Group> {
    if (group.businessId !== businessId) {
      throw new NotFoundException(GROUP_NOT_FOUND);
    }
    
    return this.groupService.addToGroup(group, businessId, employees);
  }

  @Post(':groupId/remove-employees')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted from group' })
  @Acl({ microservice: 'settings', action: AclActionsEnum.delete})
  public async removeFromGroup(
    @Param('businessId') businessId: string,
    @ParamModel(':groupId', GroupsSchemaName, true) group: Group,
    @Body() employees: EmployeesDto,
  ): Promise<Group> {
    if (group.businessId !== businessId) {
      throw new NotFoundException(GROUP_NOT_FOUND);
    }
    
    return this.groupService.removeFromGroup(group, businessId, employees);
  }
}
