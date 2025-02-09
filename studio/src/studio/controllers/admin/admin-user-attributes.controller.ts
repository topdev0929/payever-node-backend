import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, AccessTokenPayload, ParamModel, User } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { AdminUserAttributeQueryDto, UserAttributeDto } from '../../dto';
import { UserAttributeModel } from '../../models';
import { UserAttributeSchemaName } from '../../schemas';
import { UserAttributeService } from '../../services';

const USER_ATTRIBUTE_ID: string = ':userAttributeId';

@Controller('admin/user-attributes')
@ApiTags('admin user attributes')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminUserAttributesController extends AbstractController{
  constructor(
    private readonly userAttributeService: UserAttributeService,
  ) {
    super();
  }
  @Get()  
  public async getAll(    
    @Query() query: AdminUserAttributeQueryDto,
  ): Promise<any> {
    return this.userAttributeService.getForAdmin(query);
  }

  @Get(USER_ATTRIBUTE_ID)
  public async getById(
    @ParamModel(USER_ATTRIBUTE_ID, UserAttributeSchemaName) userAttribute: UserAttributeModel,
    @User() user: AccessTokenPayload,
  ): Promise<UserAttributeModel> {
    return userAttribute;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(
    @Body() body: UserAttributeDto,
  ): Promise<UserAttributeModel> {
    return this.userAttributeService.create(body);
  }

  @Patch(USER_ATTRIBUTE_ID)
  @HttpCode(HttpStatus.OK)
  public async update(
    @ParamModel(USER_ATTRIBUTE_ID, UserAttributeSchemaName) userAttribute: UserAttributeModel,
    @Body() body: UserAttributeDto,
  ): Promise<UserAttributeModel> {
    return this.userAttributeService.update(userAttribute._id, body);
  }

  @Get('/type')
  public async getType(
    @Query('businessId') businessId: string,
  ): Promise<string[]> {
    return this.userAttributeService.findType(businessId);
  }

  @Delete(USER_ATTRIBUTE_ID)
  @HttpCode(HttpStatus.OK)
  public async deleteById(
    @ParamModel(USER_ATTRIBUTE_ID, UserAttributeSchemaName) userAttribute: UserAttributeModel,
  ): Promise<void> {
    await this.userAttributeService.remove(userAttribute);
  }
}
