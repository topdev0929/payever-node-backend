import { Injectable, Inject } from '@nestjs/common';

import { RabbitMqRPCClient } from '@pe/nest-kit';

import { ContactsAppContactRpcResponseDto } from '../dto';

@Injectable()
export class RpcService {
  @Inject() private readonly rabbitMqRPCClient: RabbitMqRPCClient;
  public async getContactById(contactId: string, businessId: string): Promise<ContactsAppContactRpcResponseDto> {
    const response: ContactsAppContactRpcResponseDto[] = await this.rabbitMqRPCClient.send(
      {
        channel: 'contacts.rpc.readonly.find-one',
        exchange: 'rpc_calls',
      },
      {
        name: 'contacts.rpc.readonly.find-one',
        payload: {
          filter: {
            _id: contactId,
            businessId: businessId,
          },
          options: {
            populate: {
              path: 'fields',
              populate: {
                path: 'field',
              },
            },
          },
        },
      },
      {
        responseType: 'json',
      },
    );

    if (!response[0]) {
      return null;
    }

    return response[0];
  }
}
