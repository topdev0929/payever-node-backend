import { Body, Controller, HttpCode, HttpStatus, Param, Put, Get, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AccessTokenResultModel,
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  Roles,
  RolesEnum,
  User,
  UserTokenInterface,
  UserRoleMerchant,
} from '@pe/nest-kit';

import { UserService } from '../../users/services';
import { RequestParser, TokenService } from '../services';
import { Acl as AclInterface, Permission, User as UserEntity } from '../../users/interfaces';
import { PermissionsAssignmentDto } from '../dto/permissions-assignment.dto';
import { FastifyRequestWithIpInterface, RequestFingerprint } from '../interfaces';

const INVALID_CREDENTIALS_MESSAGE: string = 'Invalid credentials';

@Controller('api')
@ApiTags('auth')
export class PermissionsController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) { }

  @Put('/:businessUuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.user)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, type: AccessTokenResultModel, description: 'Business added' })
  public async addBusiness(
    @User() user: UserTokenInterface,
    @Req() request: FastifyRequestWithIpInterface,
    @Param('businessUuid') businessUuid: string,
  ): Promise<AccessTokenResultModel> {
    const parsedRequest: RequestFingerprint = RequestParser.parse(request);
    const userEntity: UserEntity = await this.userService.assignAbsolutePermissions(user.id, businessUuid);

    return this.tokenService.issueToken(userEntity, parsedRequest, businessUuid);
  }

  @Get('/business/:businessUuid/:appCode/has-permissions')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.user)
  public async CheckPermissionsForApp(
    @User() user: UserTokenInterface,
    @Param('businessUuid') businessUuid: string,
    @Param('appCode') appCode: string,
  ): Promise<{ hasPermissions: boolean}> {
    const businessPermissions: Permission[] = [];

    for (const role of user.roles) {
      if ((role as UserRoleMerchant).permissions) {
        (role as UserRoleMerchant).permissions.forEach((permission: Permission) => {
          if (permission.businessId === businessUuid) {
            businessPermissions.push(permission);
          }
        });
      }
    }

    if (businessPermissions.length === 0) {
      return { hasPermissions: false };
    }

    return {
      hasPermissions: businessPermissions.reduce(
        (oldValue: boolean, curr: Permission) => {
          const acl: AclInterface = curr.acls.find((item: AclInterface) => item.microservice === appCode);

          return oldValue || !!(acl && acl.read);
        },
        false,
      ),
    };
  }

  @Put('permissions/:userId/business/:businessId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.create })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: INVALID_CREDENTIALS_MESSAGE })
  @ApiResponse({ status: HttpStatus.OK, description: 'Permissions added' })
  public async assignPermissionsToUser(
    @Param('businessId') businessId: string,
    @Param('userId') userId: string,
    @Body() dto: PermissionsAssignmentDto,
  ): Promise<void> {
    await this.userService.assignPermissions(userId, businessId, dto.acls);
  }
}
