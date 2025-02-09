import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessModel, BusinessService } from '@pe/business-kit';
import { IntegrationModel, IntegrationService } from '@pe/synchronizer-kit';
import { RabbitChannelEnum } from '../../environments';
import { ThirdPartyStockChangedMessageDto, ThirdPartyStockSyncMessageDto } from '../dto/third-party-rabbit-messages';
import { OuterProcessService } from '../services';

@Controller()
export class ThirdPartyInventoryBusMessageController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly integrationService: IntegrationService,
    private readonly processService: OuterProcessService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'third-party.event.stock.created',
  })
  public async stockCreated(dto: ThirdPartyStockSyncMessageDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(dto.business.id);
    if (!business) {
      return;
    }

    const integration: IntegrationModel = await this.integrationService.findOneByName(dto.integration.name);
    if (!integration) {
      return;
    }

    await this.processService.processOuterStockCreatedEvent(business, integration, dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'third-party.event.stock.upserted',
  })
  public async stockUpserted(dto: ThirdPartyStockSyncMessageDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(dto.business.id);
    if (!business) {
      return;
    }

    const integration: IntegrationModel = await this.integrationService.findOneByName(dto.integration.name);
    if (!integration) {
      return;
    }
    await this.processService.processOuterStockUpsertedEvent(business, integration, dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'third-party.event.stock.added',
  })
  public async stockAdded(dto: ThirdPartyStockChangedMessageDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(dto.business.id);
    if (!business) {
      return;
    }

    const integration: IntegrationModel = await this.integrationService.findOneByName(dto.integration.name);
    if (!integration) {
      return;
    }

    await this.processService.processOuterStockAddedEvent(business, integration, dto);
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'third-party.event.stock.subtracted',
  })
  public async stockSubtracted(dto: ThirdPartyStockChangedMessageDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(dto.business.id);
    if (!business) {
      return;
    }

    const integration: IntegrationModel = await this.integrationService.findOneByName(dto.integration.name);
    if (!integration) {
      return;
    }

    await this.processService.processOuterStockSubtractedEvent(business, integration, dto);
  }
}
