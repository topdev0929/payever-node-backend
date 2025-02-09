import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AbstractController, Roles, RolesEnum } from '@pe/nest-kit';
import { CommonService } from '../services';
import { AppWithAccessConfigDto } from '../dto';

@Controller('app')
@ApiTags('common')
export class CommonController extends AbstractController {
  constructor(
    private readonly commonService: CommonService,
  ) {
    super();
  }

  @Get('by-app-id')
  @Roles(RolesEnum.anonymous)
  @ApiOperation({
    description: 'Checking if application access appId exist (Used by infra)',
  })
  public async getAccessConfigByAppId(
    @Query('appId') appId: string,
  ): Promise<AppWithAccessConfigDto> {
    if (!appId) {
      throw new BadRequestException('Query param appId is required');
    }

    return this.commonService.getAccessConfigByAppId(appId, true);
  }

  @Get('theme/by-app-id')
  @Roles(RolesEnum.anonymous)
  @ApiOperation({
    description: 'Checking if theme application by appId exist',
  })
  public async getApplicationThemeByAppId(
    @Query('appId') appId: string,
  ): Promise<AppWithAccessConfigDto> {
    if (!appId) {
      throw new BadRequestException('Query param appId is required');
    }

    return this.commonService.getApplicationThemeByAppId(appId);
  }
}
