import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, AccessTokenPayload, ParamModel, User } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { BusinessModel } from '../../../business/models';
import { BusinessSchemaName } from '../../../business/schemas';
import { AttributeFilterDto, IdsDto, PaginationDto, UserMediaDto } from '../../dto';
import { AdminUserMediaQueryDto } from '../../dto/admin-user-media-query.dto';
import { UserAlbumModel, UserMediaModel } from '../../models';
import { UserAlbumSchemaName, UserMediaSchemaName } from '../../schemas';
import { UserMediaService } from '../../services';


const USER_MEDIA_ID: string = ':userMediaId';

@Controller('admin/user-medias')
@ApiTags('admin user medias')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminUserMediasController extends AbstractController{
  constructor(
    private readonly userMediaService: UserMediaService,
  ) {
    super();
  }
  @Get()
  public async getAll(
    @Query() query: AdminUserMediaQueryDto,
  ): Promise<any> {
    return this.userMediaService.getForAdmin(query);
  }
   
  @Get(USER_MEDIA_ID)  
  public async findById(
    @ParamModel(USER_MEDIA_ID, UserMediaSchemaName) userMedia: UserMediaModel,
  ): Promise<UserMediaModel> {
    return this.userMediaService.findById(userMedia.id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(
    @Body() body: UserMediaDto,
    @User() user: AccessTokenPayload,
  ): Promise<UserMediaModel> {
    return this.userMediaService.create(body.businessId, body, user.roles);
  }

  @Patch(USER_MEDIA_ID)  
  @HttpCode(HttpStatus.OK)
  public async updateUserMedia(
    @ParamModel(USER_MEDIA_ID, UserMediaSchemaName) userMedia: UserMediaModel,
    @Body() body: UserMediaDto,
    @User() user: AccessTokenPayload,
  ): Promise<UserMediaModel> {
    return this.userMediaService.update(userMedia.businessId, userMedia, body, user.roles);
  }

  @Delete(USER_MEDIA_ID)
  @HttpCode(HttpStatus.OK)
  public async deleteById(
    @ParamModel('userMediaId', UserMediaSchemaName) userMedia: UserMediaModel,
  ): Promise<void> {
    await this.userMediaService.remove(userMedia);
  }

  @Post('find-by-multiple-user-attributes/business/:businessId')
  @HttpCode(HttpStatus.OK)
  public async findByMultipleAttributes(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Query() pagination: PaginationDto,
    @Body() attributeFilter: AttributeFilterDto,
  ): Promise<UserMediaModel[]> {
    return this.userMediaService.findByMultipleUserAttributes(pagination, business, attributeFilter);
  }
  
  @Post('add/album/:userAlbumId/business/:businessId')
  @HttpCode(HttpStatus.OK)
  public async addMultipleMedia(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('userAlbumId', UserAlbumSchemaName) userAlbum: UserAlbumModel,
    @Body() body: IdsDto,
  ): Promise<void> {
    return this.userMediaService.addMultipleMediaToAlbum(userAlbum.id, body, business);
  }

  @Post('remove/album')
  @HttpCode(HttpStatus.OK)
  public async removeMultipleMediaToAlbum(
    @Body() body: IdsDto,
  ): Promise<void> {
    return this.userMediaService.removeMultipleMediaFromAlbum(body);
  }

  @Post('delete-many')
  @HttpCode(HttpStatus.OK)
  public async deleteMany(
    @Body() body: IdsDto,
  ): Promise<void> {
    await this.userMediaService.deleteMany(body);
  }
}
