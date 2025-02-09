/* eslint-disable sonarjs/no-duplicate-string */
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get, Delete, Put } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { Acl, AclActionsEnum, ParamModel } from '@pe/nest-kit';
import { UpdateWidgetDto, WidgetDto, UpdateWidgetSettingDto } from '../dto';
import { BusinessModel, DashboardModel, WidgetModel } from '../models';
import { WidgetService } from '../services';
import { BusinessSchemaName, DashboardSchemaName, WidgetSchemaName } from '../schemas';
import { BusinessServiceHelper } from '../helpers/business.helper';

@Controller('business/:businessId/dashboard/:dashboardId/widget')
@ApiTags('widget')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class WidgetController {
  constructor(
    private readonly widgetService: WidgetService,
    private readonly businessServiceHelper: BusinessServiceHelper,
  ) {
  }

  @Get('available-types')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The records have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: String,
  })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.read })
  public async availableTypes(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<any> {
    return this.businessServiceHelper.availableTypes(business);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The records have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: WidgetDto,
  })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.read })
  public async findAll(
    @ParamModel('dashboardId', DashboardSchemaName) dashboard: DashboardModel,
  ): Promise<WidgetModel[]> {
    return this.widgetService.findAll(dashboard);
  }

  @Get(':widgetId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The record has been successfully fetched.',
    status: HttpStatus.OK,
    type: WidgetDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.read })
  public async findOne(
    @ParamModel('widgetId', WidgetSchemaName) widget: WidgetModel,
  ): Promise<WidgetModel> {
    await widget.populate('dashboard').execPopulate();
    await widget.populate('dashboard.business').execPopulate();

    return widget;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    description: 'The record has been successfully created.',
    status: HttpStatus.CREATED,
    type: WidgetDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.create })
  public async create(
    @ParamModel('dashboardId', DashboardSchemaName) dashboard: DashboardModel,
    @Body() dto: any,
  ): Promise<WidgetModel> {
    return this.widgetService.create(dashboard, dto);
  }

  @Put(':widgetId')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The record has been successfully updated.',
    status: HttpStatus.OK,
    type: WidgetDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.update })
  public async update(
    @ParamModel('widgetId', WidgetSchemaName) widget: WidgetModel,
    @Body() dto: UpdateWidgetDto,
  ): Promise<WidgetModel> {
    return this.widgetService.update(widget, dto);
  }

  @Delete(':widgetId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The record has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.delete })
  public async remove(
    @ParamModel('widgetId', WidgetSchemaName) widget: WidgetModel,
  ): Promise<void> {
    await this.widgetService.remove(widget);
  }

  @Put(':widgetId/settings')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The record has been successfully updated.',
    status: HttpStatus.OK,
    type: WidgetDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found.' })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.update })
  public async updateWidgetSettings(
    @ParamModel('widgetId', WidgetSchemaName) widget: WidgetModel,
    @Body() dto: UpdateWidgetSettingDto,
  ): Promise<WidgetModel> {
    return this.widgetService.updateWidgetSettings(widget, dto);
  }
}
