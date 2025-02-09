import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
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
  User,
  UserTokenInterface,
  AclActionsEnum,
  Acl,
} from '@pe/nest-kit';

import { UserDocument } from '../../projections/models';
import { UserSchemaName } from '../../projections/schema';
import {
  USER_ID_PLACEHOLDER_C,
  USER_ID_PLACEHOLDER,
} from './const';
import {
  ProfileDocument,
  ProfileService,
} from '../../message';
import { BlockedUserDocument, BlockedUsersService } from '../../message/submodules/blocked-users';
import { PrivacyDto } from '../dto';

@Controller(`/profile`)
@ApiTags('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin, RolesEnum.merchant)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly blockedUsersService: BlockedUsersService,
  ) { }

  @Get(`/username/is-occupied/:username`)
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  public async isUsernameOccupied(
    @Param('username') username: string,
  ): Promise<boolean> {
    return this.profileService.isUsernameOccupied(username);
  }

  @Patch(`/username`)
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  public async setOwnUsername(
    @User() user: UserTokenInterface,
    @Body() body: { username: string },
  ): Promise<ProfileDocument> {
    return this.profileService.setUsername(user.id, body.username);
  }

  @Patch('privacy')
  @Acl({ microservice: 'message', action: AclActionsEnum.update })
  public async updatePrivacy(
    @User() user: UserTokenInterface,
    @Body() dto: PrivacyDto,
  ): Promise<ProfileDocument> {
    return this.profileService.updatePrivacy(user.id, dto);
  }

  @Get('blacklist')
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  public async getBlockedUsers(
    @User() user: UserTokenInterface,
  ): Promise<BlockedUserDocument[]> {
    return this.blockedUsersService.getBlockedUsers(user.id);
  }

  @Post(`/blacklist/${USER_ID_PLACEHOLDER_C}`)
  @Acl({ microservice: 'message', action: AclActionsEnum.create })
  @HttpCode(HttpStatus.OK)
  public async block(
    @User() user: UserTokenInterface,
    @ParamModel(USER_ID_PLACEHOLDER_C, UserSchemaName) userToBlock: UserDocument,
    @Param(USER_ID_PLACEHOLDER) swaggerUserId: string,
  ): Promise<void> {
    await this.blockedUsersService.blockUser(user.id, userToBlock._id);
  }

  @Delete(`/blacklist/${USER_ID_PLACEHOLDER_C}`)
  @Acl({ microservice: 'message', action: AclActionsEnum.delete })
  public async unblock(
    @User() user: UserTokenInterface,
    @ParamModel(USER_ID_PLACEHOLDER_C, UserSchemaName) userToUnblock: UserDocument,
    @Param(USER_ID_PLACEHOLDER) swaggerUserId: string,
  ): Promise<void> {
    await this.blockedUsersService.unblockUser(user.id, userToUnblock._id);
  }
}
