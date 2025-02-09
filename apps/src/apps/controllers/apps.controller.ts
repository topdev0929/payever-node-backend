import { Controller, Get, Post, Patch, Delete, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AbstractController, AccessTokenPayload, JwtAuthGuard, Roles, RolesEnum, ParamModel, User } from '@pe/nest-kit';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

import { CreateAppDto, UpdateAppDto } from '../dto';
import { AppSchemaName } from '../schemas';
import { AppService } from '../services';
import { AppModel } from '../models';
import { AppVoter } from '../voters';

@Controller('apps')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.user)
export class AppsController extends AbstractController {
  constructor(
    private readonly appService: AppService,
  ) {
    super();
  }

  @Get()
  public async getUserApps(
    @User() user: AccessTokenPayload,
  ): Promise<AppModel[]> {
    return this.appService.getUserApps(user);
  }

  @Post()
  public async create(
    @Body() dto: CreateAppDto,
    @User() user: AccessTokenPayload,
  ): Promise<AppModel> {
    return this.appService.create(dto, user);
  }

  @Get(':appId')
  @ApiParam({ name: 'appId' })
  public async getOne(
    @ParamModel(':appId', AppSchemaName, true) app: AppModel,
    @User() user: AccessTokenPayload,
  ): Promise<AppModel> {
    await this.denyAccessUnlessGranted(AppVoter.VIEW, app, { user });

    return app;
  }

  @Post(':appId/request-review')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'appId' })
  public async requestReview(
    @ParamModel(':appId', AppSchemaName, true) app: AppModel,
    @User() user: AccessTokenPayload,
  ): Promise<AppModel> {
    await this.denyAccessUnlessGranted(AppVoter.EDIT, app, { user });

    return this.appService.requestReview(app);
  }

  @Patch(':appId')
  @ApiParam({ name: 'appId' })
  public async update(
    @ParamModel(':appId', AppSchemaName, true) app: AppModel,
    @Body() dto: UpdateAppDto,
    @User() user: AccessTokenPayload,
  ): Promise<AppModel> {
    await this.denyAccessUnlessGranted(AppVoter.EDIT, app, { user });

    return this.appService.update(app, dto);
  }

  @Delete(':appId')
  @ApiParam({ name: 'appId' })
  public async remove(
    @ParamModel(':appId', AppSchemaName, true) app: AppModel,
    @User() user: AccessTokenPayload,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(AppVoter.DELETE, app, { user });

    await this.appService.update(app, { enabled: false });
  }
}
