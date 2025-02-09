// tslint:disable-next-line: no-commented-code
// tslint:disable: object-literal-sort-keys
// tslint:disable: no-duplicate-string
import { Injectable } from '@nestjs/common';

import { BaseService } from './base.service';
import { RpcRabbitEventsEnum } from '../../enums';

export interface OauthResponsePayload {
  _id: string;
  id: string;
  secret: string;
  user: string;
  name: string;
  isActive: boolean;
  businessId: string;
  accessTokenLifetime: number;
  grants: string[];
  redirectUri: string;
  refreshTokenLifetime: number;
  scopes: string[];
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class ClientService extends BaseService {
  public async getClient(businessId: string, userId: string = 'organization-module'): Promise<OauthResponsePayload> {
    const clients: OauthResponsePayload[] = await this.getClients(businessId);

    if (!clients || !clients.length) {
      return this.createClient(businessId, userId);
    }

    return clients[0];
  }

  private async getClients(businessId: string): Promise<OauthResponsePayload[]> {
    const response: any = await this.sendRPCCall(
      RpcRabbitEventsEnum.AuthRpcGetClients,
      {
        businessId,
      },
    );

    return response[0];
  }

  private async createClient(businessId: string, userId: string): Promise<OauthResponsePayload> {
    const response: any = await this.sendRPCCall(
      RpcRabbitEventsEnum.AuthRpcCreateClient,
      {
        businessId,
        userId,
        name: 'PSP',
        redirectUri: '',
      },
    );

    return response[0];
  }
}
