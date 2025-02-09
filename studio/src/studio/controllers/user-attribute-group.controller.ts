import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, AccessTokenPayload, Acl, AclActionsEnum, ParamModel, User } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { PaginationDto, UserAttributeGroupDto } from '../dto';
import { UserAttributeGroupModel } from '../models';
import { UserAttributeGroupSchemaName } from '../schemas';
import { UserAttributeGroupService } from '../services';
import {
  UserAttributeGroupCreateVoter,
  UserAttributeGroupReadVoter,
  UserAttributeGroupRemoveVoter,
  UserAttributeGroupUpdateVoter,
} from '../voters';
import { BusinessSchemaName } from '../../business/schemas';
import { BusinessModel } from '../../business/models';

@Controller(':businessId/attribute/group')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiTags('Attribute Group API')
export class UserAttributeGroupController extends AbstractController{
  constructor(
    private readonly userAttributeGroupService: UserAttributeGroupService,
  ) {
    super();
  }

  @Post()
  @Acl({ microservice: 'studio', action: AclActionsEnum.create })
  public async createAttributeGroup(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() body: UserAttributeGroupDto,
    @User() user: AccessTokenPayload,
  ): Promise<UserAttributeGroupModel> {
    await this.denyAccessUnlessGranted(UserAttributeGroupCreateVoter.CREATE, body, user);

    return this.userAttributeGroupService.create(body);
  }

  @Patch('/:userAttributeGroupId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.update })
  public async updateAttributeGroup(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Param('userAttributeGroupId') userAttributeGroupId: string,
    @ParamModel('userAttributeGroupId', UserAttributeGroupSchemaName) userAttributeGroup: UserAttributeGroupModel,
    @User() user: AccessTokenPayload,
    @Body() body: UserAttributeGroupDto,
  ): Promise<UserAttributeGroupModel> {
    await this.denyAccessUnlessGranted(
      UserAttributeGroupUpdateVoter.UPDATE,
      { body: body, userAttributeGroup: userAttributeGroup },
      user,
    );

    return this.userAttributeGroupService.update(userAttributeGroupId, body);
  }

  @Get()
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getAttributeGroup(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Query() pagination: PaginationDto,
  ): Promise<UserAttributeGroupModel[]> {

    return this.userAttributeGroupService.findAll(business.id, pagination);
  }

  @Get('/:userAttributeGroupId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findById(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('userAttributeGroupId', UserAttributeGroupSchemaName) userAttributeGroup: UserAttributeGroupModel,
    @User() user: AccessTokenPayload,
  ): Promise<UserAttributeGroupModel> {
    await this.denyAccessUnlessGranted(UserAttributeGroupReadVoter.READ, userAttributeGroup, user);

    return userAttributeGroup;
  }

  @Delete('/:userAttributeGroupId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.delete })
  public async deleteById(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('userAttributeGroupId', UserAttributeGroupSchemaName) userAttributeGroup: UserAttributeGroupModel,
    @User() user: AccessTokenPayload,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(UserAttributeGroupRemoveVoter.REMOVE, userAttributeGroup, user);
    await this.userAttributeGroupService.remove(userAttributeGroup);
  }
}
