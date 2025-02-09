import { Injectable } from '@nestjs/common';
import { ConnectionModel, ConnectionService, IntegrationModel } from '@pe/third-party-sdk';
import { BusinessModel } from '../../business/models';
import { getServiceUrl } from '../../environments';
import { DeprecatedIntegrationApiService } from '../../third-party/services';
import { ConfigureInboundSMSDto, SendMessageDto } from '../dto';

@Injectable()
export class CommunicationsApiService {
  constructor(
    private readonly integrationApiService: DeprecatedIntegrationApiService,
    private readonly connectionService: ConnectionService,
  ) { }

  public async sendMessage(
    integration: IntegrationModel,
    business: BusinessModel,
    sendMessageDto: SendMessageDto,
  ): Promise<any> {
    const url: string = `${getServiceUrl(integration.url)}/send`;

    return this.integrationApiService.callIntegration(business, integration, 'post', url, sendMessageDto);
  }

  public async configureInbound(
    integration: IntegrationModel,
    business: BusinessModel,
    configureDto: ConfigureInboundSMSDto,
  ): Promise<void> {
    const integrationUrl: string = getServiceUrl(integration.url);
    const url: string = `${integrationUrl}/phone/inbound/setup`;
    const dto: { phone: string; url: string } = {
      phone: configureDto.phone,
      url: `${integrationUrl}/phone/inbound/message`,
    };
    await this.integrationApiService.callIntegration(business, integration, 'post', url, dto);
  }

  public async getNumbers(integration: IntegrationModel, business: BusinessModel): Promise<string[]> {
    const connection: ConnectionModel =
      await this.connectionService.findFirstByBusinessAndIntegration(business, integration);

    // tslint:disable-next-line:max-line-length
    const url: string = `${getServiceUrl(integration.url)}/phone/${connection.authorizationId}/phone-numbers`;

    return this.integrationApiService.callIntegration(business, integration, 'get', url);
  }
}
