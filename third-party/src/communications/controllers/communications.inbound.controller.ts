import { Body, Controller, HttpService, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParamModel } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import {
  IntegrationModel,
  IntegrationSchemaName,
  IntegrationSubscriptionModel,
  IntegrationSubscriptionService,
} from '@pe/third-party-sdk';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

import { BusinessModel } from '../../business/models';
import { BusinessSchemaName } from '../../common/mongoose-schema.names';
import { environment } from '../../environments';
import { ConfigureInboundSMSDto, InboundMessageDto } from '../dto';
import { CommunicationsApiService } from '../services/communications-api-service';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const INTEGRATION_NAME_PLACEHOLDER: string = ':integrationName';

@Controller()
@ApiTags('communications')
@UseGuards(JwtAuthGuard)
export class CommunicationsInboundController {
  constructor(
    private readonly communicationsApiService: CommunicationsApiService,
    private readonly subscriptionService: IntegrationSubscriptionService,
    private readonly http: HttpService,
  ) { }

  @Post('communications/inbound/message')
  @Roles(RolesEnum.anonymous)
  public async inboundSMS(
    @Body() inboundDto: InboundMessageDto,
  ): Promise<{ message: any }> {
    const request: Observable<AxiosResponse<any>> =
      this.http.post<any>(`${environment.devicePaymentsUrl}/api/v1/inbound/message`, inboundDto);
    const response: AxiosResponse<any> = await request.toPromise();

    return { message: response.data.message };
  }

  @Post('business/:businessId/communications/:integrationName/inbound/configure')
  @Roles(RolesEnum.anonymous)
  public async sendMessage(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel({ name: INTEGRATION_NAME_PLACEHOLDER}, IntegrationSchemaName) integration: IntegrationModel,
    @Body() configureDto: ConfigureInboundSMSDto,
  ): Promise<void>  {
    const subscription: IntegrationSubscriptionModel =
      await this.subscriptionService.findOneByBusinessAndIntegration(business, integration);
    if (!subscription) {
      throw new NotFoundException(`Business ${business.id} doesn't have ${integration.name} installed`);
    }

    await this.communicationsApiService.configureInbound(integration, business, configureDto);
  }
}
