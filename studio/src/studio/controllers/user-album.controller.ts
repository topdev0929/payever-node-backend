import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, AccessTokenPayload, Acl, AclActionsEnum, ParamModel, User } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { BusinessModel } from '../../business/models';
import { BusinessSchemaName } from '../../business/schemas';
import { AttributeFilterDto, BuilderPaginationDto, UpdateUserAlbumDto, UserAlbumDto } from '../dto';
import { UserAlbumModel } from '../models';
import { UserAlbumSchemaName } from '../schemas';
import { UserAlbumService } from '../services';
import { UserAlbumCreateVoter, UserAlbumReadVoter, UserAlbumRemoveVoter, UserAlbumUpdateVoter } from '../voters';

@Controller(':businessId/album')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiTags('User Album API')
export class UserAlbumController extends AbstractController{
  constructor(
    private readonly userAlbumService: UserAlbumService,
  ) {
    super();
  }

  @Post()
  @Acl({ microservice: 'studio', action: AclActionsEnum.create })
  public async createAlbum(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() body: UserAlbumDto,
    @User() user: AccessTokenPayload,
  ): Promise<UserAlbumModel> {
    await this.denyAccessUnlessGranted(UserAlbumCreateVoter.CREATE, body, user);

    return this.userAlbumService.create(business, body);
  }

  @Patch('/:userAlbumId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.update })
  public async updateAlbum(
    @Param('userAlbumId') userAlbumId: string,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('userAlbumId', UserAlbumSchemaName) userAlbum: UserAlbumModel,
    @Body() body: UpdateUserAlbumDto,
    @User() user: AccessTokenPayload,
  ): Promise<UserAlbumModel> {
    await this.denyAccessUnlessGranted(UserAlbumUpdateVoter.UPDATE, body, user);

    return this.userAlbumService.update(userAlbumId, business, body);
  }

  @Get()
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getAlbums(
    @Query() pagination: BuilderPaginationDto,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<UserAlbumModel[]> {

    return this.userAlbumService.findByBusinessId(pagination, business);
  }

  @Get('/:userAlbumId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findById(
    @ParamModel('userAlbumId', UserAlbumSchemaName) userAlbum: UserAlbumModel,
    @User() user: AccessTokenPayload,
  ): Promise<UserAlbumModel> {
    await this.denyAccessUnlessGranted(UserAlbumReadVoter.READ, userAlbum, user);
    const userAttributeRefference: string = 'userAttributes.attribute';
    const selectFields: string = 'icon name type';

    return userAlbum.populate({
      path: userAttributeRefference,
      select: selectFields,
    }).execPopulate();
  }

  @Get('/parent/:userAlbumId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findByParent(
    @Query() pagination: BuilderPaginationDto,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('userAlbumId', UserAlbumSchemaName) userAlbum: UserAlbumModel,
    @User() user: AccessTokenPayload,
  ): Promise<UserAlbumModel[]> {
    await this.denyAccessUnlessGranted(UserAlbumReadVoter.READ, userAlbum, user);

    return this.userAlbumService.findByBusinessId(pagination, business, userAlbum.id);
  }

  @Get('/ancestor/:userAlbumId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findByAncestor(
    @Query() pagination: BuilderPaginationDto,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('userAlbumId', UserAlbumSchemaName) userAlbum: UserAlbumModel,
    @User() user: AccessTokenPayload,
  ): Promise<UserAlbumModel[]> {
    await this.denyAccessUnlessGranted(UserAlbumReadVoter.READ, userAlbum, user);

    return this.userAlbumService.findByBusinessIdAndAncestor(pagination, business, userAlbum.id);
  }

  @Delete('/:userAlbumId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.delete })
  public async deleteById(
    @ParamModel('userAlbumId', UserAlbumSchemaName) userAlbum: UserAlbumModel,
    @User() user: AccessTokenPayload,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(UserAlbumRemoveVoter.REMOVE, userAlbum, user);
    await this.userAlbumService.remove(userAlbum);
  }

  @Get('/by-user-attribute/:attributeId/:attributeValue')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findByAttribute(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Query() pagination: BuilderPaginationDto,
    @Param('attributeId') attributeId: string,
    @Param('attributeValue') attributeValue: string,
  ): Promise<UserAlbumModel[]> {

    return this.userAlbumService.findByUserAttribute(pagination, business, attributeId, attributeValue);
  }

  @Post('/by-user-attribute')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findByMultipleAttributes(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Query() pagination: BuilderPaginationDto,
    @Body() attributeFilter: AttributeFilterDto,
  ): Promise<UserAlbumModel[]> {

    return this.userAlbumService.findByMultipleUserAttributes(pagination, business, attributeFilter);
  }
}
