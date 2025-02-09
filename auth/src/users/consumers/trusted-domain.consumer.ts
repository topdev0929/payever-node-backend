import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TrustedDomainDto } from '../dto';
import { UserRabbitMessagesEnum } from '../enums';
import { TrustedDomainService } from '../services';

@Controller()
export class TrustedDomainConsumer {
  constructor(
    private readonly trustedDomainService: TrustedDomainService,
  ) { }

  @MessagePattern({
    name: UserRabbitMessagesEnum.TrustedDomainAdded,
  })
  public async onTrustedDomainAddedEvent(data: TrustedDomainDto): Promise<void> {
    return this.trustedDomainService.add(data);
  }

  @MessagePattern({
    name: UserRabbitMessagesEnum.TrustedDomainDeleted,
  })
  public async onTrustedDomainDeletedEvent(data: TrustedDomainDto): Promise<void> {
    return this.trustedDomainService.delete(data.businessId, data.domain);
  }
}
