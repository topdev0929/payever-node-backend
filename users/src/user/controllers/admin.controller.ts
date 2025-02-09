import {
  Body, Controller, Delete, Get, Header,
  HttpCode,
  HttpStatus, Patch, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ParamModel } from '@pe/nest-kit';
import {
  JwtAuthGuard,
  Roles,
  RolesEnum,
} from '@pe/nest-kit/modules/auth';
import {
  AdminUserListDto, AminDeleteUserDto, UpdateUserAccountDto,
} from '../dto';
import { UserModel } from '../models';
import { UserSchemaName } from '../schemas';
import {
  BusinessService,
  UserService,
} from '../services';
import { userToUserDtoTransformer } from '../transformers/user-to-user-dto.transformer';


const ContentType: string = 'Content-Type';
const ApplicationJson: string = 'application/json';
const invalidAuthApi: any = { status: 400, description: 'Invalid authorization token.' };
const unauthorizedApi: any = { status: 401, description: 'Unauthorized.' };

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly userService: UserService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Get('users')
  @ApiBearerAuth()
  @ApiResponse({
    description: 'The user list have been successfully fetched.',
    isArray: true,
    status: 200,
  })
  @ApiResponse(invalidAuthApi)
  @ApiResponse(unauthorizedApi)
  public async getUsersList(
    @Query() query: AdminUserListDto,
  ): Promise<any[]> {
    return this.userService.retrieveListForAdmin(query);
  }

  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  @Get('users/:userId')
  @ApiBearerAuth()
  public async getUserInformation(
    @ParamModel(':userId', UserSchemaName, true) user: UserModel,
  ): Promise<UserModel> {
    return userToUserDtoTransformer(user);
  }

  @HttpCode(HttpStatus.OK)
  @Header(ContentType, ApplicationJson)
  @Delete('users/:userId')
  public async deleteUser(
    @ParamModel(':userId', UserSchemaName) user: UserModel,
    @Body() dto: AminDeleteUserDto,
  ): Promise<UserModel> {
    await user.populate('businessDocuments').execPopulate();

    if (dto.deleteOwnBusinesses) {
      await this.businessService.deleteBusinessesByOwner(user);
    }

    for (const business of user.businessDocuments) {
      await this.businessService.removeBusinessFromUser(user, business);
    }

    return this.userService.remove(user);
  }

  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  @Patch('users/:userId')
  public async updateUserInformation(
    @ParamModel(':userId', UserSchemaName, true) user: UserModel,
    @Body() updateUserAccountDto: UpdateUserAccountDto,
  ): Promise<void> {
    return this.userService.updateUserAccount(user, updateUserAccountDto);
  }
}
