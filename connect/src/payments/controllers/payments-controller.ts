import {
  Body, Controller, Get, HttpException, Param, Post, UseGuards,
  NotFoundException, Patch, Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { Request } from 'express';

import { ParamModel } from '@pe/nest-kit';
import { PaymentsService } from '../services/payments.service';
import { PaymentPayloadInterface } from '../interfaces';
import { IntegrationService, IntegrationSubscriptionModel, IntegrationModel } from '../../integration';
import { BusinessModelLocal, BusinessSchemaName } from '../../business';
import { UpdatePaymentDocumentsPayloadDto } from '../dto';

@Controller('business/:businessId/payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiTags('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly integrationService: IntegrationService,
  ) { }

  @Get(':integrationName/payload')
  @Acl({ microservice: 'connect', action: AclActionsEnum.read })
  public async findOne(
    @Param('integrationName') integrationName: string,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModelLocal,
  ): Promise<PaymentPayloadInterface> {
    const integration: IntegrationModel = await this.integrationService.findOneByName(integrationName);
    if (!integration) {
      throw new NotFoundException(`${integrationName} does not exist`);
    }

    return this.paymentsService.getPayload(business, integration);
  }

  @Patch(':integrationName/payload')
  @Acl({ microservice: 'connect', action: AclActionsEnum.update })
  public async updatePayload(
    @Param('integrationName') integrationName: string,
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModelLocal,
    @Body() body: UpdatePaymentDocumentsPayloadDto,
    @Req() request: Request): Promise<void> {
    const integration: IntegrationModel = await this.integrationService.findOneByName(integrationName);
    if (!integration) {
      throw new NotFoundException(`${integrationName} does not exist`);
    }

    const subscription: IntegrationSubscriptionModel
      = await this.paymentsService.updatePayload(business, integration, body);

    if (body.application_sent) {
      await this.paymentsService
        .sendApplicationSubmitEmailNotification(integration, subscription, business, request);
    }
  }
}
