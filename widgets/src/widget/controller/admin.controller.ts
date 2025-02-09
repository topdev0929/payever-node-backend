import {
  Body, Controller, Delete, HttpCode, HttpStatus, Patch, Post, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamModel } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { MongooseModel } from '../../common/enums';

import { CreateWidgetDto, UpdateWidgetDto } from '../dto';
import { WidgetModel } from '../models';
import { WidgetService } from '../services';

@Controller('admin/widgets')
@ApiTags('admin')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class AdminController {

  public constructor(private readonly widgetService: WidgetService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The record has been successfully created.' })
  @Roles(RolesEnum.admin)
  public async create(
    @Body() createWidgetDto: CreateWidgetDto,
  ): Promise<WidgetModel> {
    return this.widgetService.create(createWidgetDto);
  }

  @Delete(':widgetId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The record has been successfully deleted.' })
  @Roles(RolesEnum.admin)
  public async remove(
    @ParamModel('widgetId', MongooseModel.Widget) widget: WidgetModel,
  ): Promise<void> {
    await this.widgetService.remove(widget);
  }

  @Patch(':widgetId')
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully patched.' })
  @Roles(RolesEnum.admin)
  public async patch(
    @ParamModel('widgetId', MongooseModel.Widget) widget: WidgetModel,
    @Body() updateWidgetDto: UpdateWidgetDto,
  ): Promise<WidgetModel> {
    return this.widgetService.update(widget, updateWidgetDto);
  }
}
