import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { OrganizationDto } from '../dto';
import { OrganizationRabbitEventsEnum } from '../enums';
import { OrganizationService } from '../services';
import { RabbitChannel } from '../../environments';

@Controller()
export class OrganizationConsumer {
  constructor(
    private readonly organizationService: OrganizationService,
  ) { }

  @MessagePattern({
    channel: RabbitChannel.OnboardingCreated,
    name: OrganizationRabbitEventsEnum.OrganizationCreated,
  })
  public async onOrganizationCreated(dto: OrganizationDto): Promise<void> {
    await this.handleData(dto);
  }

  @MessagePattern({
    channel: RabbitChannel.OnboardingCreated,
    name: OrganizationRabbitEventsEnum.OrganizationUpdated,
  })
  public async onOrganizationUpdated(dto: OrganizationDto): Promise<void> {
    await this.handleData(dto);
  }

  private async handleData(dto: OrganizationDto): Promise<void> {
    await this.organizationService.upsert(dto);
  }
}
