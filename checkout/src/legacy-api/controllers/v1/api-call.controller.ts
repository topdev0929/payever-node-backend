import { Controller, ForbiddenException, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { AccessTokenPayload, JwtAuthGuard, ParamModel, Roles, RolesEnum, User } from '@pe/nest-kit';
import { OauthService } from '../../../common/services';
import { ApiCallSchemaName } from '../../../mongoose-schema';
import { ApiCallDto } from '../../dto';
import { ApiCallModel } from '../../../common/models';

@Controller()
@ApiTags('legacy-api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ApiCallController {
  constructor(
    private readonly oauthService: OauthService,
  ) { }

  @Get(':id')
  @Roles(RolesEnum.oauth)
  @ApiParam({ name: 'id' })
  public async apiCallInfo(
    @ParamModel(':id', ApiCallSchemaName) apiCall: ApiCallModel,
    @User() user: AccessTokenPayload,
  ): Promise<ApiCallDto> {
    try {
      this.oauthService.getOauthUserBusiness(user, apiCall.businessId);
    } catch (e) {
      throw new ForbiddenException(`You're not allowed to get api call`);
    }

    return plainToClass<ApiCallDto, ApiCallModel>(ApiCallDto, apiCall);
  }
}
