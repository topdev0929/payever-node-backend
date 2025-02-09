import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, AccessTokenPayload, Acl, AclActionsEnum, ParamModel, User } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { PaginationDto, UserAttributeDto } from '../dto';
import { AttributeModel, UserAttributeModel } from '../models';
import { UserAttributeSchemaName } from '../schemas';
import { UserAttributeService } from '../services';
import {
  UserAttributeCreateVoter,
  UserAttributeReadVoter,
  UserAttributeRemoveVoter,
  UserAttributeUpdateVoter,
} from '../voters';
import { BusinessSchemaName } from '../../business/schemas';
import { BusinessModel } from '../../business/models';

@Controller(':businessId/attribute')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiTags('Attribute API')
export class UserAttributeController extends AbstractController{
  constructor(
    private readonly userAttributeService: UserAttributeService,
  ) {
    super();
  }

  @Post()
  @Acl({ microservice: 'studio', action: AclActionsEnum.create })
  public async createAttribute(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() body: UserAttributeDto,
    @User() user: AccessTokenPayload,
  ): Promise<UserAttributeModel> {
    await this.denyAccessUnlessGranted(UserAttributeCreateVoter.CREATE, body, user);

    return this.userAttributeService.create(body);
  }

  @Patch('/:userAttributeId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.update })
  public async updateAttribute(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Param('userAttributeId') userAttributeId: string,
    @ParamModel('userAttributeId', UserAttributeSchemaName) userAttribute: UserAttributeModel,
    @User() user: AccessTokenPayload,
    @Body() body: UserAttributeDto,
  ): Promise<UserAttributeModel> {
    await this.denyAccessUnlessGranted(UserAttributeUpdateVoter.UPDATE, userAttribute, user);

    return this.userAttributeService.update(userAttributeId, body);
  }

  @Get()
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getAttribute(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Query() pagination: PaginationDto,
  ): Promise<UserAttributeModel[]> {

    return this.userAttributeService.findAll(business.id, pagination);
  }

  @Get('/type')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getType(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<string[]> {

    return this.userAttributeService.findType(business.id);
  }

  @Get('/type/:type')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getAttributeByType(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Query() pagination: PaginationDto,
    @Param('type') type: string,
  ): Promise<AttributeModel[]> {

    return this.userAttributeService.findAllByType(business.id, type, pagination);
  }


  @Get('/:userAttributeId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findById(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('userAttributeId', UserAttributeSchemaName) userAttribute: UserAttributeModel,
    @User() user: AccessTokenPayload,
  ): Promise<UserAttributeModel> {
    await this.denyAccessUnlessGranted(UserAttributeReadVoter.READ, userAttribute, user);

    return userAttribute;
  }

  @Delete('/:userAttributeId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.delete })
  public async deleteById(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('userAttributeId', UserAttributeSchemaName) userAttribute: UserAttributeModel,
    @User() user: AccessTokenPayload,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(UserAttributeRemoveVoter.REMOVE, userAttribute, user);
    await this.userAttributeService.remove(userAttribute);
  }
}
