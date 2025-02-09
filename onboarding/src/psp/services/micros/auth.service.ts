import { Injectable } from '@nestjs/common';

import { BaseService } from './base.service';
import { AuthRegisterPayloadInterface } from '../../../onboarding/interfaces/outgoing';
import { RpcRabbitEventsEnum } from '../../enums';

@Injectable()
export class AuthService extends BaseService {
  public async registerUserRPC(
    authDto: AuthRegisterPayloadInterface,
  ): Promise<any> {
    return this.sendRPCCall(
      RpcRabbitEventsEnum.AuthRpcCreateUser,
      {
        email: authDto.email,

        first_name: authDto.first_name,
        last_name: authDto.last_name,

        forceGeneratePassword: true,
      },
    );
  }
  
  public async resetUserPasswordRPC(
    email: string,
  ): Promise<any> {
    return this.sendRPCCall(
      RpcRabbitEventsEnum.AuthRpcResetPasswrod,
      {
        email,
      },
    );
  }

  /*
   * Before creating business
   */
  public async addBusinessPermissionsRPC(businessId: string, userId: string): Promise<void> {
    await this.sendRPCCall(
      RpcRabbitEventsEnum.AuthRpcAssignAbsolutePermissions,
      {
        businessId,
        userId,
      },
    );
  }
}
