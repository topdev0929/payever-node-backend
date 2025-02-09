import { HttpException, HttpService, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { NestKitLogFactory } from '@pe/nest-kit/modules/logging';
import {
  ActionChooser,
  ConnectionModel,
  ConnectionService,
  ConsumerEventsEnum,
  InnerActionModel,
  IntegrationApiService,
  IntegrationModel,
  IntegrationSubscriptionService,
} from '@pe/third-party-sdk';
import { AxiosError, AxiosResponse, Method } from 'axios';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BusinessModel } from '../../business/models';
import { getServiceUrl } from '../../environments';
import { DeprecatedConnectionEventsProducer } from '../producer';

@Injectable()
export class DeprecatedIntegrationApiService {
  constructor(
    private readonly subscriptionService: IntegrationSubscriptionService,
    private readonly connectionService: ConnectionService,
    private readonly connectionEventsProducer: DeprecatedConnectionEventsProducer,
    private readonly apiService: IntegrationApiService,
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) { }

  /**
   * @deprecated Old code below, everything must be reviewed without breaking and removed
   */
  public async callIntegration(
    business: BusinessModel,
    integration: IntegrationModel,
    httpMethod: Method = 'post',
    url?: string,
    data?: any,
    headers?: any,
  ): Promise<any> {
    let connection: ConnectionModel =
      await this.connectionService.findFirstByBusinessAndIntegration(business, integration);

    if (connection) {
      this.logger.log({
        context: 'DeprecatedIntegrationApiService',
        message: `Connection found`,

        connection: connection,
      });
    }

    if (!connection) {
      this.logger.log({
        context: 'DeprecatedIntegrationApiService',
        message: `Connection not found, starting auto-connect`,

        connection: connection,
      });

      if (integration.autoConnect) {
        const action: string = 'connect';
        const actionModel: InnerActionModel = ActionChooser.chooseAppropriateAction(integration, action);
        if (!actionModel) {
          this.logger.warn({
            context: 'IntegrationSubscriptionBusMessageController',
            message: `Integration ${integration.name} has not ${action} action.`,

            action,
            business,
            integration,
          });
        }

        const result: any = await this.apiService.action(business, integration, actionModel, { });

        this.logger.log({
          context: 'IntegrationSubscriptionBusMessageController',
          message: `Action '${action}' for '${integration.name}' of business '${business.id}' finished.`,

          action,
          business,
          integration,
          result,
        });
      }

      connection = await this.connectionService.findFirstByBusinessAndIntegration(business, integration);
    }

    if (data) {
      if (integration.autoConnect) {
        data.id = connection.authorizationId;
        data.connected = connection.connected;
      }
      // Some integrations (shopify) may need to link this call with business
      data.businessId = business.id;

      this.logger.log({
        context: 'DeprecatedIntegrationApiService',
        message: `Request data added`,

        data: data,
      });
    }

    this.logger.log({
      context: 'DeprecatedIntegrationApiService',
      message: `Starting call`,

      data: data,
      headers: headers,
      httpMethod: httpMethod,
      integration: integration,
      url: url,
    });

    const responseModel: any = await this.call(integration, url, data, httpMethod, headers);

    if (
      integration.autoConnect
        && responseModel
        && responseModel.hasOwnProperty('connected')
        && responseModel.connected !== connection.connected
    ) {
      if (responseModel.connected) {
        await this.connectionEventsProducer.sendDeprecatedConnectionStatusEvent(
          ConsumerEventsEnum.IntegrationConnected,
          integration,
          business,
        );
        await this.connectionService.setConnected(connection, true);
      } else {
        await this.connectionEventsProducer.sendDeprecatedConnectionStatusEvent(
          ConsumerEventsEnum.IntegrationDisconnected,
          integration,
          business,
        );
        await this.connectionService.setConnected(connection, false);
      }

      await connection.save();
    }

    return responseModel;
  }

  private async call(
    integration: IntegrationModel,
    url: string,
    data?: any,
    httpMethod: Method = 'post',
    headers: any = { },
  ): Promise<any> {
    if (!url) {
      url = `${getServiceUrl(integration.url)}/flow/start`;
    }
    this.logger.log({
      message: `Calling third-party apiUrl: ${url}, method: ${httpMethod}`,

      data: data,
    });
    const response: Observable<AxiosResponse<any>> = this.httpService.request({
      data,
      headers: {
        'User-Agent': headers['user-agent'] || '',
        authorization: headers.authorization || '',
      },
      method: httpMethod,
      url: url,
    });

    return response
      .pipe(
        map((res: any) => res.data),
        catchError((error: AxiosError) => {
          if (!error.response) {
            this.logger.error(`Error while doing ${httpMethod} ${url}: ${error.message}`);
            throw new InternalServerErrorException(error.message);
          }

          this.logger.error(NestKitLogFactory.getLogFromAxiosResponse(error.response));
          throw new HttpException(error.response.data, error.response.status);
        }),
      )
      .toPromise();
  }
}
