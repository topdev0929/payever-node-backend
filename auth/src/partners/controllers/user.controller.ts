import { Controller, Delete, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, PartnerTagName, Roles, RolesEnum } from '@pe/nest-kit';

import { User as UserModel } from '../../users/interfaces';
import { UserSchemaName } from '../../users/schemas';
import { UserService } from '../services';

const accessGrantedDescription: string = 'Access granted';
const invalidCredentialsDescription: string = 'Invalid credentials';

@Controller('api/partner')
@ApiTags('api/partner')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class UserController {
  constructor(private readonly partnerService: UserService) { }

  @Put('/:userId/:tagName')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: invalidCredentialsDescription })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async addPartnerTag(
    @ParamModel(':userId', UserSchemaName) user: UserModel,
    @Param('tagName') tagName: PartnerTagName,
  ): Promise<void> {
    return this.partnerService.assignTag(user, tagName);
  }

  @Delete('/:userId/:tagName')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: invalidCredentialsDescription })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async removePartnerTag(
    @ParamModel(':userId', UserSchemaName) user: UserModel,
    @Param('tagName') tagName: PartnerTagName,
  ): Promise<void> {
    return this.partnerService.removeTag(user, tagName);
  }
}
