import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessModel, BusinessService } from '@pe/business-kit';
import { IntegrationModel, IntegrationService } from '@pe/synchronizer-kit';
import { RabbitChannelEnum } from '../../environments';
import { ThirdPartyProductMessageDto, ThirdPartyProductRemovedMessageDto } from '../dto/third-party-rabbit-messages';
import { OuterProcessService } from '../services';

@Controller()
export class ThirdPartyProductsBusMessageController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly integrationService: IntegrationService,
    private readonly processService: OuterProcessService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'third-party.event.product.created',
  })
  public async productCreated(dto: ThirdPartyProductMessageDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(
      dto.business.id,
    );
    if (!business) {
      return;
    }

    const integration: IntegrationModel = await this.integrationService.findOneByName(
      dto.integration.name,
    );
    if (!integration) {
      return;
    }

    return this.processService.processOuterProductCreatedEvent(
      business,
      integration,
      dto,
    );
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'third-party.event.product.updated',
  })
  public async productUpdated(dto: ThirdPartyProductMessageDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(
      dto.business.id,
    );
    if (!business) {
      return;
    }

    const integration: IntegrationModel = await this.integrationService.findOneByName(
      dto.integration.name,
    );
    if (!integration) {
      return;
    }

    return this.processService.processOuterProductUpdatedEvent(
      business,
      integration,
      dto,
    );
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'third-party.event.product.upserted',
  })
  public async productUpserted(dto: ThirdPartyProductMessageDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(
      dto.business.id,
    );

    if (!business) {
      return;
    }

    const integration: IntegrationModel = await this.integrationService.findOneByName(
      dto.integration.name,
    );

    if (!integration) {
      return;
    }

    return this.processService.processOuterProductUpsertedEvent(
      business,
      integration,
      dto,
    );
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'third-party.event.product.removed',
  })
  public async productRemoved(dto: ThirdPartyProductRemovedMessageDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(
      dto.business.id,
    );
    if (!business) {
      return;
    }

    const integration: IntegrationModel = await this.integrationService.findOneByName(
      dto.integration.name,
    );
    if (!integration) {
      return;
    }

    return this.processService.processOuterProductRemovedEvent(
      business,
      integration,
      dto as any,
    );
  }
}
