/* tslint:disable:no-duplicate-string*/
import { Controller, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { Acl, AclActionsEnum, ParamModel } from '@pe/nest-kit';
import { WidgetDto } from '../dto';
import { WidgetModel } from '../models';
import { StatisticsService } from '../services';
import { WidgetSchemaName } from '../schemas';

@Controller(':widgetId/statistics')
@ApiTags('statistics')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
  ) {
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
  public async getData(
    @ParamModel('widgetId', WidgetSchemaName) widget: WidgetModel,
  ): Promise<any> {
    return {
      data: await this.statisticsService.getData(widget),
      widgetId: widget.id,
    };
  }
}
