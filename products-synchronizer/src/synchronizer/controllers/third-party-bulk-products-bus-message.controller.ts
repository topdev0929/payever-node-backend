import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessModel, BusinessService } from '@pe/business-kit';
import { IntegrationModel, IntegrationService } from '@pe/synchronizer-kit';
import { RabbitChannelEnum, environment } from '../../environments';
import { ThirdPartyProductMessageDto } from '../dto/third-party-rabbit-messages';
import { OuterProcessService } from '../services';

@Controller()
export class ThirdPartyBulkProductsBusMessageController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly integrationService: IntegrationService,
    private readonly processService: OuterProcessService,
  ) { }

  @MessagePattern({
    channel: environment.rabbitProductSyncQueueName,
    name: 'third-party.event.bulk.products.upserted',
    routingKey: environment.routingKey,
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

    await this.processService.processOuterProductUpsertedEvent(
      business,
      integration,
      dto,
    );

    if (dto.synchronization.isFinished) {
      process.exit(0);
    }
  }

  @MessagePattern({
    channel: RabbitChannelEnum.Synchronizer,
    name: 'third-party.event.bulk.products.upserted.static',
  })
  public async productUpsertedStatic(dto: ThirdPartyProductMessageDto): Promise<void> {
    await this.productUpserted(dto);
  }
}
