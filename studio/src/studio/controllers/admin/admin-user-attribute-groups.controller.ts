import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, ParamModel } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { AdminBaseQueryDto, UserAttributeGroupDto } from '../../dto';
import { UserAttributeGroupModel } from '../../models';
import { UserAttributeGroupSchemaName } from '../../schemas';
import { UserAttributeGroupService } from '../../services';

const USER_ATTRIBUTE_GROUP_ID: string = ':userAttributeGroupId';

@Controller('admin/user-attribute-groups')
@ApiTags('admin user attribute groups')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminUserAttributeGroupsController extends AbstractController{
  constructor(
    private readonly userAttributeGroupService: UserAttributeGroupService,
  ) {
    super();
  }

  @Get()  
  public async getAll(    
    @Query() query: AdminBaseQueryDto,
  ): Promise<any> {
    return this.userAttributeGroupService.getForAdmin(query);
  }

  @Get(USER_ATTRIBUTE_GROUP_ID)
  public async getById(
    @ParamModel(USER_ATTRIBUTE_GROUP_ID, UserAttributeGroupSchemaName) userAttributeGroup: UserAttributeGroupModel,
  ): Promise<UserAttributeGroupModel> {
    return userAttributeGroup;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(    
    @Body() body: UserAttributeGroupDto,
  ): Promise<UserAttributeGroupModel> {
    return this.userAttributeGroupService.create(body);
  }

  @Patch(USER_ATTRIBUTE_GROUP_ID)  
  @HttpCode(HttpStatus.OK)
  public async update(        
    @ParamModel('userAttributeGroupId', UserAttributeGroupSchemaName) userAttributeGroup: UserAttributeGroupModel,    
    @Body() body: UserAttributeGroupDto,
  ): Promise<UserAttributeGroupModel> {
    return this.userAttributeGroupService.update(userAttributeGroup._id, body);
  }


  @Delete(USER_ATTRIBUTE_GROUP_ID)  
  @HttpCode(HttpStatus.OK)
  public async delete(
    @ParamModel(USER_ATTRIBUTE_GROUP_ID, UserAttributeGroupSchemaName) userAttributeGroup: UserAttributeGroupModel,
  ): Promise<void> {
    await this.userAttributeGroupService.remove(userAttributeGroup);
  }
}
