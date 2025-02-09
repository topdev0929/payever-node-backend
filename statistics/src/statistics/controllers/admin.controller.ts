/* eslint-disable sonarjs/no-duplicate-string */
import { Controller, HttpCode, HttpStatus, UseGuards, Get, Post, Put, Body, Delete } from '@nestjs/common';
import { ParamModel } from '@pe/nest-kit';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { 
  BusinessDto,
  CreateDashboardDto,
  CubeDto,
  DashboardDetailsDto,
  DashboardDto,
  UpdateDashboardDto,
  UpdateWidgetDto,
  UpdateWidgetSettingDto,
  WidgetDto,
} from '../dto';
import { CubeModel, DashboardModel, WidgetModel } from '../models';
import { CubeSchemaName, DashboardSchemaName, WidgetSchemaName } from '../schemas';
import { CubeService, DashboardService, WidgetService } from '../services';
import { BusinessService } from '@pe/business-kit';

@Controller('admin')
@ApiTags('admin')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class AdminController {
  constructor(
    private readonly cubeService: CubeService,
    private readonly businessService: BusinessService,
    private readonly dashboardService: DashboardService,
    private readonly widgetService: WidgetService,
  ) {
  }

  @Get('cube')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The records have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: CubeDto,
  })
  public async findAll(): Promise<CubeDto[]> {
    return this.cubeService.findAll();
  }

  @Get('businesses')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The records have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: BusinessDto,
  })
  public async findAllBusinesses(): Promise<BusinessDto[]> {
    return this.businessService.findAll();
  }

  @Post('cube/:id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The records have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: CubeDto,
  })
  public async toggleEnabled(
    @ParamModel(':id', CubeSchemaName) cube: CubeModel,
  ): Promise<CubeDto> {
    return this.cubeService.toggleEnable(cube);
  }

  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The records have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: DashboardDto,
  })
  public async findAllDashboard(): Promise<DashboardDetailsDto[]> {
    const dashboards: DashboardModel[] = await this.dashboardService.findAllForAdmin();
    const cubes: CubeModel[] = await this.cubeService.findAll();
    const availableTypes: string[] = cubes
    .filter((cube: CubeModel) => cube.enabled)
    .map((cube: CubeModel) => cube.code);
    
    return dashboards.map((dashboard: DashboardModel) => {
      return {
        _id: dashboard._id,
        availableTypes,
        name: dashboard.name,
      } as DashboardDetailsDto;
    });
  }

  @Get('dashboard/:dashboardId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The record has been successfully fetched.',
    status: HttpStatus.OK,
    type: DashboardDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  public async findOneDashboard(
    @ParamModel('dashboardId', DashboardSchemaName) dashboard: DashboardModel,
  ): Promise<DashboardModel> {
    await dashboard.populate('business').execPopulate();

    return dashboard;
  }

  @Post('dashboard')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The record has been successfully created.',
    status: HttpStatus.CREATED,
    type: DashboardDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  public async createDashboard(
    @Body() dto: CreateDashboardDto,
  ): Promise<any> {
    return this.dashboardService.createForAdmin(dto);
  }

  @Put('dashboard/:dashboardId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The record has been successfully updated.',
    status: HttpStatus.OK,
    type: DashboardDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  public async updateDashboard(
    @ParamModel('dashboardId', DashboardSchemaName) dashboard: DashboardModel,
    @Body() dto: UpdateDashboardDto,
  ): Promise<DashboardModel> {
    return this.dashboardService.update(dashboard, dto);
  }

  @Delete('dashboard/:dashboardId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The record has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  public async removeDashboard(
    @ParamModel('dashboardId', DashboardSchemaName) dashboard: DashboardModel,
  ): Promise<void> {
    await this.dashboardService.remove(dashboard);
  }

  @Get('dashboard/:dashboardId/widget')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The records have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: WidgetDto,
  })
  public async findAllWidgets(
    @ParamModel('dashboardId', DashboardSchemaName) dashboard: DashboardModel,
  ): Promise<WidgetModel[]> {
    return this.widgetService.findAll(dashboard);
  }

  @Get('dashboard/:dashboardId/widget/:widgetId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The record has been successfully fetched.',
    status: HttpStatus.OK,
    type: WidgetDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  public async findOne(
    @ParamModel('widgetId', WidgetSchemaName) widget: WidgetModel,
  ): Promise<WidgetModel> {
    await widget.populate('dashboard').execPopulate();
    await widget.populate('dashboard.business').execPopulate();

    return widget;
  }

  @Post('dashboard/:dashboardId/widget')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The record has been successfully created.',
    status: HttpStatus.CREATED,
    type: WidgetDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  public async createWidget(
    @ParamModel('dashboardId', DashboardSchemaName) dashboard: DashboardModel,
    @Body() dto: any,
  ): Promise<WidgetModel> {
    return this.widgetService.create(dashboard, dto);
  }

  @Put('dashboard/:dashboardId/widget/:widgetId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The record has been successfully updated.',
    status: HttpStatus.OK,
    type: WidgetDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  public async updateWidget(
    @ParamModel('widgetId', WidgetSchemaName) widget: WidgetModel,
    @Body() dto: UpdateWidgetDto,
  ): Promise<WidgetModel> {
    return this.widgetService.update(widget, dto);
  }

  @Delete('dashboard/:dashboardId/widget/:widgetId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The record has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  public async removeWidget(
    @ParamModel('widgetId', WidgetSchemaName) widget: WidgetModel,
  ): Promise<void> {
    await this.widgetService.remove(widget);
  }

  @Put('dashboard/:dashboardId/widget/:widgetId/settings')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The record has been successfully updated.',
    status: HttpStatus.OK,
    type: WidgetDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  public async updateWidgetSettings(
    @ParamModel('widgetId', WidgetSchemaName) widget: WidgetModel,
    @Body() dto: UpdateWidgetSettingDto,
  ): Promise<WidgetModel> {
    return this.widgetService.updateWidgetSettings(widget, dto);
  }
}
