import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { UserRabbitMessagesEnum } from '../enums';
import { TrustedDomainInterface } from '../interfaces';
import { TrustedDomainTransformer } from '../transformers';

@Injectable()
export class TrustedDomainEventProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async produceDomainAddedEvent(domain: TrustedDomainInterface): Promise<void> {
    await this.send(UserRabbitMessagesEnum.TrustedDomainAdded, TrustedDomainTransformer.interfaceToDto(domain));
  }

  public async produceDomainDeletedEvent(domain: TrustedDomainInterface): Promise<void> {
    await this.send(UserRabbitMessagesEnum.TrustedDomainDeleted, TrustedDomainTransformer.interfaceToDto(domain));
  }

  private async send(event: UserRabbitMessagesEnum, payload: any): Promise<void> {
    await this.rabbitClient.send(
      { channel: event, exchange: 'async_events' },
      { name: event, payload },
      true
    );
  }
}
