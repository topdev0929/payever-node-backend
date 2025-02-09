import { Injectable } from '@nestjs/common';

import { BaseService } from './base.service';
import { RpcRabbitEventsEnum } from '../../enums';

@Injectable()
export class UsersService extends BaseService {
  public async registerBusinessRPC(data: any, userId: string): Promise<any> {
    return this.sendRPCCall(
      RpcRabbitEventsEnum.UsersRpcCreateBusiness,
      {
        business: data.business,
        user: data.auth,
        userId,
      },
    );
  }

  public async removeBusinessRPC(businessId: string): Promise<any> {
    return this.sendRPCCall(
      RpcRabbitEventsEnum.UsersRpcDeleteBusiness,
      {
        businessId,
      },
    );
  }
}
