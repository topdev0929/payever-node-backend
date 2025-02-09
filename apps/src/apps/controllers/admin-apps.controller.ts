import { Controller, Body, Get, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesEnum, ParamModel } from '@pe/nest-kit';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

import { AppModel } from '../models';
import { AppSchemaName } from '../schemas';
import { AppService } from '../services';
import { AppStatusDto } from '../dto';

@Controller('admin/apps')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin)
export class AdminAppsController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get()
  public async getAll(
  ): Promise<AppModel[]> {
    return this.appService.getAll();
  }

  @Get(':appId')
  @ApiParam({ name: 'appId' })
  public async findOne(
    @ParamModel(':appId', AppSchemaName, true) app: AppModel,
  ): Promise<AppModel> {
    return app;
  }

  @Post(':appId/status')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'appId' })
  public async approveApp(
    @ParamModel(':appId', AppSchemaName, true) app: AppModel,
    @Body() dto: AppStatusDto,
  ): Promise<AppModel> {
    return this.appService.changeStatus(app, dto);
  }
}
