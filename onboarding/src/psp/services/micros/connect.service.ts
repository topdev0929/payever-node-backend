// tslint:disable: no-identical-functions
import { Injectable } from '@nestjs/common';

import { BaseService } from './base.service';
import { RpcRabbitEventsEnum } from '../../enums';

export interface PaymentMethodResponse {
  installed: boolean;
  scopes: string[];
}

@Injectable()
export class ConnectService extends BaseService {
  public async installAppRPC(
    businessId: string,
    integrationName: string,
  ): Promise<PaymentMethodResponse> {
    return this.sendRPCCall(
      RpcRabbitEventsEnum.ConnectRpcInstallIntegration,
      {
        businessId,
        integrationName,
      },
    );
  }

  public async uninstallAppRPC(
    businessId: string,
    integrationName: string,
  ): Promise<void> {
    return this.sendRPCCall(
      RpcRabbitEventsEnum.ConnectRpcUninstallIntegration,
      {
        businessId,
        integrationName,
      },
    );
  }
}
