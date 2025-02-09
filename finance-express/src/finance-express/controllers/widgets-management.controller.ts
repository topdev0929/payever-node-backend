import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common';
import { AbstractController, Acl, AclActionsEnum, ParamModel, User, UserTokenInterface } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { ApiTags } from '@nestjs/swagger';

import { BusinessModel, BusinessSchemaName } from '../../business';
import { WidgetModel } from '../interfaces/entities';
import { UpdateWidgetDto } from '../dto';
import { ValidationService, WidgetsService } from '../services';
import { WidgetSchemaName } from '../schemas';
import { WidgetDeleteVoter, WidgetEditVoter } from '../voters';

@Controller('business/:businessId/widget')
@UseGuards(JwtAuthGuard)
@ApiTags('finance-express')
@Roles(RolesEnum.merchant)
export class WidgetsManagementController extends AbstractController {
  constructor(
    private readonly widgetsService: WidgetsService,
  ) {
    super();
  }

  @Post()
  @Acl({ microservice: 'finance-express', action: AclActionsEnum.create })
  public async create(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() dto: UpdateWidgetDto,
  ): Promise<WidgetModel> {
    await ValidationService.validate(dto);

    return this.widgetsService.create(dto, business);
  }

  @Put('/:widgetId')
  @Acl({ microservice: 'finance-express', action: AclActionsEnum.update })
  public async update(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel(':widgetId', WidgetSchemaName) widget: WidgetModel,
    @Body() dto: UpdateWidgetDto,
    @User() user: UserTokenInterface,
  ): Promise<WidgetModel> {
    await this.denyAccessUnlessGranted(WidgetEditVoter.EDIT, widget, user);
    await ValidationService.validate(dto);

    return this.widgetsService.update(widget, dto);
  }

  @Delete('/:widgetId')
  @Acl({ microservice: 'finance-express', action: AclActionsEnum.delete })
  public async deleteWidget(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel(':widgetId', WidgetSchemaName) widget: WidgetModel,
    @User() user: UserTokenInterface,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(WidgetDeleteVoter.DELETE, widget, user);

    return this.widgetsService.delete(widget);
  }
}
