import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessModel, BusinessService } from '@pe/business-kit';
import { IntegrationModel, IntegrationService, SynchronizationModel } from '@pe/synchronizer-kit';
import { RabbitChannelEnum } from '../../environments';
import { InventoryEventDto } from '../dto';
import { SynchronizeEventEnum } from '../enums';
import { SynchronizationService, SynchronizationTriggerService } from '../services';

@Controller()
export class SynchronizationInventoryBusMessageController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly integrationService: IntegrationService,
    private readonly synchronizationService: SynchronizationService,
    private readonly triggerService: SynchronizationTriggerService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: SynchronizeEventEnum.INVENTORY_TRIGGER,
  })
  public async trigger(dto: InventoryEventDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(dto.business.id);
    if (!business) {
      return;
    }

    const integration: IntegrationModel = await this.integrationService.findOneByName(dto.integration.name);
    if (!integration) {
      return;
    }

    const synchronization: SynchronizationModel =
      await this.synchronizationService.findOneByBusinessAndIntegration(business, integration);
    if (!synchronization) {
      return;
    }

    return this.triggerService.triggerInventorySynchronization(synchronization);
  }
}
