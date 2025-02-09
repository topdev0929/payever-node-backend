import { Injectable, Global, HttpException, Logger, InternalServerErrorException } from '@nestjs/common';
import { NestKitLogFactory } from '@pe/nest-kit/modules/logging';
import { IntercomService } from '@pe/nest-kit';
import { Observable } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IntegrationModel, InnerActionModel } from '../models';
import { IntegrationSchemaName } from '../schemas';
import { FastifyRequest } from 'fastify';
import { ServiceUrlRetriever } from '../services';

@Global()
@Injectable()
export class IntegrationService {
  constructor(
    @InjectModel(IntegrationSchemaName) private readonly integrationModel: Model<IntegrationModel>,
    private readonly serviceUrlRetriever: ServiceUrlRetriever,
    private readonly httpService: IntercomService,
    private readonly logger: Logger,
  ) { }

  public async findByCode(code: string): Promise<IntegrationModel> {
    return this.integrationModel.findOne({ code });
  }

  public async process(
    businessId: string,
    integration: IntegrationModel,
    action: InnerActionModel,
    data: any = { },
  ): Promise<any> {
    this.logger.log({
      context: 'IntegrationService',
      message: `Processing action '${action}' for '${integration.code}' of business '${businessId}'`,

      action,
      businessId,
      data,
      integration,
    });

    const result: any = await this.action(businessId, integration, action, data);

    this.logger.log({
      context: 'IntegrationService',
      message: `Action '${action}' for '${integration.code}' of business '${businessId}' finished.`,

      action,
      businessId,
      data,
      integration,
      result,
    });

    return result;
  }

  public async action(
    businessId: string,
    integration: IntegrationModel,
    action: InnerActionModel,
    data: { } = { },
    request?: FastifyRequest<any>,
  ): Promise<any> {
    const url: string = this.serviceUrlRetriever.composeActionUrl(
      businessId,
      integration,
      action,
      data,
    );
    if (!url) {
      throw new InternalServerErrorException(
        `Integration's '${integration.code}' action '${action}' misses action URL.`,
      );
    }

    this.logger.log({
      context: 'IntegrationService',
      message: `Executing action "${action}" for "${integration.code}"`,
      url,
    });
    const headers: { } = await this.prepareHeaders(request);
    const response: Observable<AxiosResponse<any>> = await this.httpService.request({
      data,
      headers,
      method: action.method,
      params: action.method === 'GET' ? data : { },
      url,
    });

    return response
      .pipe(
        map((res: any): any => res.data),
        catchError((error: AxiosError): any => {
          if (error.response) {
            this.logger.warn(NestKitLogFactory.getLogFromAxiosResponse(error.response));
            throw new HttpException(error.response.data, error.response.status);
          } else {
            this.logger.error(NestKitLogFactory.getLogFromAxiosError(error));
            throw new InternalServerErrorException(error);
          }
        }),
      )
      .toPromise();
  }

  private async prepareHeaders(request?: FastifyRequest<any>): Promise<{ }> {
    let userAgent: string = null;
    if (request) {
      userAgent = request.headers['user-agent'];
    }

    return userAgent ? { 'user-agent': userAgent} : { };
  }

}
