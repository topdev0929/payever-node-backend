import { Injectable } from '@nestjs/common';
import { TrustedDomainEventsEnum } from '../enums';
import { EventListener } from '@pe/nest-kit';
import { TrustedDomainEventProducer } from '../producers';
import { TrustedDomainInterface } from '../interfaces';

@Injectable()
export class SendTrustedDomainRabbitMessageListener {
  constructor(
    private readonly trustedDomainEventsProducer: TrustedDomainEventProducer,
  ) { }

  @EventListener(TrustedDomainEventsEnum.TrustedDomainCreated)
  public async SendTrustedDomainAddedRabbitMessage(domainModel: TrustedDomainInterface): Promise<void> {
    await this.trustedDomainEventsProducer.produceDomainAddedEvent(domainModel);
  }

  @EventListener(TrustedDomainEventsEnum.TrustedDomainRemoved)
  public async SendTrustedDomainRemovedRabbitMessage(domainModel: TrustedDomainInterface): Promise<void> {
    await this.trustedDomainEventsProducer.produceDomainDeletedEvent(domainModel);
  }
}
