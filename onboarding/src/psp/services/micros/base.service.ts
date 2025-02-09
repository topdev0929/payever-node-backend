import { HttpService, Logger, Injectable } from '@nestjs/common';

import { RabbitMqRPCClient, IntercomService } from '@pe/nest-kit';

@Injectable()
export class BaseService {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly intercomService: IntercomService,
    protected readonly rabbitMqRPCClient: RabbitMqRPCClient,
    private readonly logger: Logger,
  ) { }

  protected sendRPCCall(eventName: string, payload: any): Promise<any> {
    return this.rabbitMqRPCClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload,
      },
      {
        responseType: 'json',
      },
    ).catch((error: any) => {
      this.logger.error(
        {
          data: payload,
          error: error.message,
          message: `Failed ${eventName} RPC call`,
          routingKey: eventName,
        },
        error.stack,
        'BaseService',
      );
    });
  }

  protected getAxiosRequestConfig(axiosConfig: any): any {
    return {
      headers: {
        Authorization: `Bearer ${axiosConfig.token}`,
        'User-Agent': axiosConfig.userAgent,
      },
    };
  }
}
