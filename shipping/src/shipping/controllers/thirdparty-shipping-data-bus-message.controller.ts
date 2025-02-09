import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessService } from '@pe/business-kit';
import { RabbitChannelsEnum } from '../../environments/rabbitmq';
import { BusinessModel } from '../../business/models';
import { IntegrationModel } from '../../integration/models';
import { IntegrationService } from '../../integration/services';
import { ThirdPartyShippingDataMessageDto } from '../dto/third-party-shipping-data-message.dto';
import { OuterProcessService } from '../services/outer-process.service';

@Controller()
export class ThirdPartyShippingDataBusMessageController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly integrationService: IntegrationService,
    private readonly processService: OuterProcessService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Shipping,
    name: 'third-party.event.shipping-data.sync',
  })
  public async shippingDataSynced(dto: ThirdPartyShippingDataMessageDto): Promise<void> {
    this.logger.log(`EventListener sync shipping data ${dto}`);
    const business: BusinessModel = await this.businessService.findOneById(
      dto.business.id,
    ) as BusinessModel;
    if (!business) {
      return;
    }

    const integration: IntegrationModel = await this.integrationService.findOneByName(
      dto.integration.name,
    );
    if (!integration) {
      return;
    }

    return this.processService.processOuterShippingDataSyncEvent(
      business,
      integration,
      dto,
    );
  }
}
