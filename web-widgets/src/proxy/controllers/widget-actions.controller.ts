import { Body, Controller,  NotFoundException, Param, Post, Res, UseGuards, Logger } from '@nestjs/common';
import { AbstractController } from '@pe/nest-kit';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { constants } from 'http2';
import { ApiTags } from '@nestjs/swagger';
import { InnerActionModel, IntegrationModel } from '../models';
import { IntegrationService } from '../services';
import { ActionChooser } from '../helpers';

const BUSINESS_ID_PLACEHOLDER: string = 'businessId';
const INTEGRATION_CODE_PLACEHOLDER: string = 'integrationCode';
const ACTION_PLACEHOLDER: string = 'action';

@ApiTags('Merchant actions')
@Controller('/app/:integrationCode/business/:businessId/action/:action')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@Acl(
  { microservice: 'checkout', action: AclActionsEnum.create },
  { microservice: 'checkout', action: AclActionsEnum.update },
  { microservice: 'checkout', action: AclActionsEnum.read },
  { microservice: 'checkout', action: AclActionsEnum.delete },
)
export class WidgetActionsController extends AbstractController {
  constructor(
    private readonly integrationService: IntegrationService,
    private readonly logger: Logger,
  ) {
    super();
  }

  @Post()
  public async action(
    @Param(INTEGRATION_CODE_PLACEHOLDER) integrationCode: string,
    @Param(BUSINESS_ID_PLACEHOLDER) businessId: string,
    @Param(ACTION_PLACEHOLDER) action: string,
    @Body() data: any,
    @Res() response: any,
  ): Promise<any> {
    const integration: IntegrationModel = await this.integrationService.findByCode(integrationCode);
    if (!integration) {
      throw new NotFoundException(`Integration "${integrationCode}" not found`);
    }

    const actionModel: InnerActionModel = ActionChooser.chooseAppropriateAction(integration, action);
    if (!actionModel) {
      this.logger.warn({
        context: 'IntegrationService',
        message: `Can't find requested action '${action}' of integration '${integration.code}'`,

        action,
        businessId,
        data,
        integration,
      });

      throw new NotFoundException(
        `Can't find requested action '${action}' of integration '${integration.code}'`);
    }

    const result: any = await this.integrationService.process(businessId, integration, actionModel, data);

    response
      .status(constants.HTTP_STATUS_OK)
      .send(result)
    ;
  }

}
