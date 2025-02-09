import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AbstractController,
  Acl,
  AclActionsEnum,
  JwtAuthGuard,
  ParamModel,
  Roles,
  RolesEnum,
} from '@pe/nest-kit';
import { BusinessModel, BusinessSchemaName } from '../../business';
import { WidgetModel } from '../interfaces/entities';
import { WidgetsService } from '../services';
import { WidgetTypesEnum } from '../enums';
import { WidgetSchemaName } from '../schemas';

@Controller('business/:businessId/widgets')
@UseGuards(JwtAuthGuard)
@ApiTags('finance-express')
@Roles(RolesEnum.merchant)
export class WidgetsController extends AbstractController {
  constructor(
    private readonly widgetsService: WidgetsService,
  ) {
    super();
  }

  @Get()
  @Acl({ microservice: 'finance-express', action: AclActionsEnum.read })
  public async getList(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<WidgetModel[]> {
    return this.widgetsService.getWidgetsListForBusiness(business);
  }

  @Get('/:widgetId')
  @Roles(RolesEnum.anonymous)
  public async getWidget(
    @ParamModel(
      {
        _id: ':widgetId',
      },
      WidgetSchemaName,
    ) widget: WidgetModel,
  ): Promise<WidgetModel> {
    return widget;
  }

  @Get('/type/:widgetType')
  @Acl({ microservice: 'finance-express', action: AclActionsEnum.read })
  public async getListByType(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @Param('widgetType') widgetType: WidgetTypesEnum,
  ): Promise<WidgetModel[]> {
    return this.widgetsService.getWidgetsByType(business, widgetType);
  }
}
