/* tslint:disable:no-duplicate-string*/
import { Controller, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { Acl, AclActionsEnum, ParamModel } from '@pe/nest-kit';
import { BusinessModel } from '../models';
import { WidgetService } from '../services';
import { BusinessSchemaName } from '../schemas';
import { WidgetTypeEnum } from '../enums/widget-type.enum';
import { SizeValueEnum, ViewTypeValueEnum } from '../enums';

@Controller('business/:businessId/widgetData')
@ApiTags('widgetData')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class WidgetDataController {
  constructor(
    private readonly widgetService: WidgetService,
  ) {
  }

  @Get(':widgetType')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The records have been successfully fetched.',
    isArray: true,
    status: HttpStatus.OK,
    type: String,
  })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.read })
  public async getWidgetData(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Param('widgetType') widgetType: WidgetTypeEnum,
  ): Promise<any> {
    return this.widgetService.getWidgetData(business, widgetType);
  }

  @Get('widget-types')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'The records have been successfully fetched.',
    status: HttpStatus.OK,
    type: Object,
  })
  @Acl({ microservice: 'statistics', action: AclActionsEnum.read })
  public async getWidgetTypes(): Promise<any> {
    return {
      widgetSize: Object.keys(SizeValueEnum),
      widgetType: Object.keys(ViewTypeValueEnum),
    };
  }
}
