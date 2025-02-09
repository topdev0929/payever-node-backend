import {
  Controller, Get, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamModel } from '@pe/nest-kit';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { MongooseModel } from '../../common/enums';

import { GetWidgetDto } from '../dto';
import { WidgetModel } from '../models';
import { WidgetService } from '../services';

@Controller('widget')
@ApiTags('widget')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class WidgetController {

  public constructor(private readonly widgetService: WidgetService) { }

  @Get(':widgetId')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.', type: GetWidgetDto })
  public async findOne(
    @ParamModel('widgetId', MongooseModel.Widget) widget: WidgetModel,
  ): Promise<WidgetModel> {
    return widget;
  }

  @Get('type/:widgetType')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, description: 'The record has been successfully fetched.', type: GetWidgetDto })
  public async findOneByType(
    @ParamModel({ type: ':widgetType' }, MongooseModel.Widget) widget: WidgetModel,
  ): Promise<WidgetModel> {
    return widget;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'commerceos', action: AclActionsEnum.read })
  @ApiResponse({
    description: 'The records have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: GetWidgetDto,
  })
  public async findAll(): Promise<WidgetModel[]> {
    return this.widgetService.findAll();
  }
}
