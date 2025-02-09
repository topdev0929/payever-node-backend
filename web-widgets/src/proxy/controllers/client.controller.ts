import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, Logger, Post, Body, Res, NotFoundException, Param } from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesEnum, Acl, AclActionsEnum } from '@pe/nest-kit/modules/auth';
import { AbstractController } from '@pe/nest-kit';
import { IntegrationService } from '../services';
import { GetClientActionDto, GetClientRatesDto } from '../dto';
import { IntegrationModel, InnerActionModel } from '../models';
import { ActionChooser } from '../helpers';
import { constants } from 'http2';
import { WidgetActions } from '../enums';
import { plainToClass } from 'class-transformer';

@ApiTags('Client')
@Controller()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant, RolesEnum.oauth)
@Acl(
  { microservice: 'checkout', action: AclActionsEnum.update },
  { microservice: 'checkout', action: AclActionsEnum.read },
)
export class ClientController extends AbstractController {
  constructor(
    private readonly integrationService: IntegrationService,
    private readonly logger: Logger,
  ) {
    super();
  }

  @Post('/widgets')
  public async getWidgetList(
    @Body() dto: GetClientActionDto,
    @Res() response: any,
  ): Promise<any> {
    const result: any = await this.runAction(WidgetActions.GetWidgets, dto.businessId, dto.integration, dto);

    response
      .status(constants.HTTP_STATUS_OK)
      .send(result)
    ;
  }

  @Post('/payment-options')
  public async getPaymentOptions(
    @Body() dto: GetClientActionDto,
    @Res() response: any,
  ): Promise<any> {
    const result: any =
      await this.runAction(WidgetActions.SupportedPaymentOptions, dto.businessId, dto.integration, dto);

    response
      .status(constants.HTTP_STATUS_OK)
      .send(result)
    ;
  }

  @Post('/widget/:widgetId')
  public async getWidgetById(
    @Body() dto: GetClientActionDto,
    @Param('widgetId') widgetId: string,
    @Res() response: any,
  ): Promise<any> {
    let actionData: any = dto ? dto : { };
    actionData = {
      ...actionData,
      widgetId: widgetId,
    };

    const result: any = await this.runAction(WidgetActions.GetWidgetById, dto.businessId, dto.integration, actionData);

    response
      .status(constants.HTTP_STATUS_OK)
      .send(result)
    ;
  }

  @Post('/widget/:widgetId/rates')
  public async getRates(
    @Body() dto: any,
    @Param('widgetId') widgetId: string,
    @Res() response: any,
  ): Promise<any> {
    const calculateRatesDto: GetClientRatesDto = plainToClass<GetClientRatesDto, any>(
      GetClientRatesDto,
      dto,
    );

    let actionData: any = calculateRatesDto ? calculateRatesDto : { };
    actionData = {
      ...actionData,
      widgetId: widgetId,
    };

    const result: any = await this.runAction(WidgetActions.Rates, dto.businessId, dto.integration, actionData);

    response
      .status(constants.HTTP_STATUS_OK)
      .send(result)
    ;
  }

  public async runAction(
    action: string,
    businessId: string,
    integrationCode: string,
    data: any,
  ): Promise<any> {
    const integration: IntegrationModel = await this.integrationService.findByCode(integrationCode);
    if (!integration) {
      throw new NotFoundException(`Integration "${integrationCode}" not found`);
    }

    const actionModel: InnerActionModel =
      ActionChooser.chooseAppropriateClientAction(integration, action);
    if (!actionModel) {
      this.logger.warn({
        context: 'IntegrationService',
        message:
          `Can't find requested client action '${action}' of integration '${integration.code}'`,

        action,
        businessId,
        data,
        integration: integrationCode,
      });

      throw new NotFoundException(
        `Can't find requested client action '${action}' of integration '${integration.code}'`);
    }

    return this.integrationService.process(businessId, integration, actionModel, data);
  }

}
