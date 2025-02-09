import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RpcGetClientsDto, RpcCreateClientDto } from '../dto';
import { OAuthService } from '../services';
import { OAuthClient } from '../interfaces';
import { RabbitMessagesEnum } from '../../common';

@Controller()
export class RpcOauthConsumer {
  constructor(
    private readonly oauthService: OAuthService,
  ) { }

  @MessagePattern({
    name: RabbitMessagesEnum.RpcGetClients,
  })
  public async getClients(dto: RpcGetClientsDto): Promise<OAuthClient[]> {
    return this.oauthService.listClients(dto.businessId, dto.clientIds);
  }

  @MessagePattern({
    name: RabbitMessagesEnum.RpcCreateClient,
  })
  public async createClients(dto: RpcCreateClientDto): Promise<OAuthClient> {
    return this.oauthService.createClient(dto.userId, dto.businessId, dto);
  }
}
