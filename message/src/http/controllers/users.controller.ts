import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import {
  Roles,
  RolesEnum,
  ParamModel,
  JwtAuthGuard,
  AclActionsEnum,
  Acl,
} from '@pe/nest-kit';
import { BusinessSchemaName, BusinessModel } from '@pe/business-kit';
import { FilterQuery } from 'mongoose';

import { UsersService } from '../../projections/services';
import { UserDocument } from '../../projections/models';
import {
  BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
  BUSINESS_ID_PLACEHOLDER,
} from './const';
import { FastifyRequestLocal } from '../interfaces';
import {
  ProfileService,
} from '../../message';
import { UserHttpResponseDto } from '../../message/dto';
import { userToResponseDto } from '../../message/transformers';

@Controller(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/users`)
@ApiTags('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin, RolesEnum.merchant)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profileService: ProfileService,
  ) { }

  @Get()
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  public async findUsers(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @Query() query: FastifyRequestLocal['query'],
  ): Promise<UserHttpResponseDto[]> {
    const filter: FilterQuery<UserDocument> = JSON.parse(query.filter || '{}');

    const users: UserDocument[] = await this.usersService.find({
      ...filter,
      'businesses': business._id,
    }).populate('profile');

    return (await Promise.all(
      users
        .reverse()
        .map(
          (user: UserDocument) => this.profileService.checkPrivacy(user),
        ),
    )).map(userToResponseDto);
  }
}
