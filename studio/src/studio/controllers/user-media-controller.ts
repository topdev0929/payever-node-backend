import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, AccessTokenPayload, Acl, AclActionsEnum, ParamModel, User } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { BusinessModel } from '../../business/models';
import { BusinessSchemaName } from '../../business/schemas';
import {
  AttributeFilterDto,
  DuplicateMediaDto,
  MoveMediaDto,
  PaginationDto,
  SearchMediaDto,
  UserMediaDto,
} from '../dto';
import { UserAlbumModel, UserMediaModel } from '../models';
import { UserAlbumSchemaName, UserMediaSchemaName } from '../schemas';
import { UserMediaService } from '../services';
import { UserMediaCreateVoter, UserMediaReadVoter, UserMediaRemoveVoter, UserMediaUpdateVoter } from '../voters';

@Controller(':businessId/media')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiTags('User Media API')
export class UserMediaController extends AbstractController{
  constructor(
    private readonly userMediaService: UserMediaService,
  ) {
    super();
  }

  @Post()
  @Acl({ microservice: 'studio', action: AclActionsEnum.create })
  public async createUserMedia(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() body: UserMediaDto,
    @User() user: AccessTokenPayload,
  ): Promise<UserMediaModel> {
    await this.denyAccessUnlessGranted(UserMediaCreateVoter.CREATE, body, user);

    return this.userMediaService.create(business.id, body, user.roles);
  }

  @Get()
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getUserMedia(
    @Query() pagination: PaginationDto,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<UserMediaModel[]> {

    return this.userMediaService.findByBusinessId(pagination, business);
  }
 
  @Get('/noalbum')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getUserMediaWithNoAlbum(
    @Query() pagination: PaginationDto,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<UserMediaModel[]> {

    return this.userMediaService.findWithNoAlbumByBusinessId(pagination, business);
  }

  @Get('/search')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async searchUserMedia(
    @Query() search: SearchMediaDto,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<UserMediaModel[]> {

    return this.userMediaService.searchMedia(search, business);
  }

  @Get('/album/:userAlbumId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async getMediaByAlbum(
    @Query() pagination: PaginationDto,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('userAlbumId', UserAlbumSchemaName) userAlbum: UserAlbumModel,
  ): Promise<UserMediaModel[]> {

    return this.userMediaService.findByBusinessAndAlbumId(pagination, business, userAlbum);
  }

  @Get('/:userMediaId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findById(
    @ParamModel('userMediaId', UserMediaSchemaName) userMedia: UserMediaModel,
    @User() user: AccessTokenPayload,
  ): Promise<UserMediaModel> {
    await this.denyAccessUnlessGranted(UserMediaReadVoter.READ, userMedia, user);

    return this.userMediaService.findById(userMedia.id);
  }

  @Patch('/:userMediaId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.create })
  public async updateUserMedia(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('userMediaId', UserMediaSchemaName) userMedia: UserMediaModel,
    @Body() body: UserMediaDto,
    @User() user: AccessTokenPayload,
  ): Promise<UserMediaModel> {
    await this.denyAccessUnlessGranted(UserMediaUpdateVoter.UPDATE, body, user);

    return this.userMediaService.update(business.id, userMedia, body, user.roles);
  }

  @Get('/by-user-attribute/:attributeId/:attributeValue')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findByAttribute(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Query() pagination: PaginationDto,
    @Param('attributeId') attributeId: string,
    @Param('attributeValue') attributeValue: string,
  ): Promise<UserMediaModel[]> {

    return this.userMediaService.findByUserAttribute(pagination, business, attributeId, attributeValue);
  }

  @Post('/by-user-attribute')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findByMultipleAttributes(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Query() pagination: PaginationDto,
    @Body() attributeFilter: AttributeFilterDto,
  ): Promise<UserMediaModel[]> {

    return this.userMediaService.findByMultipleUserAttributes(pagination, business, attributeFilter);
  }

  @Delete('/:userMediaId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.delete })
  public async deleteById(
    @ParamModel('userMediaId', UserMediaSchemaName) userMedia: UserMediaModel,
    @User() user: AccessTokenPayload,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(UserMediaRemoveVoter.REMOVE, userMedia, user);
    await this.userMediaService.remove(userMedia);
  }

  @Post('/duplicate')
  @Acl({ microservice: 'studio', action: AclActionsEnum.create })
  public async duplicate(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() dto: DuplicateMediaDto,
  ): Promise<UserMediaModel[]> {
    return this.userMediaService.duplicate(business, dto);
  }

  @Post('/move')
  @Acl({ microservice: 'studio', action: AclActionsEnum.update })
  public async move(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() dto: MoveMediaDto,
  ): Promise<UserMediaModel[]> {
    return this.userMediaService.move(business, dto);
  }
}
