import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitBinding } from '../../../environments/rabbit-mq-binding.enum';
import { RemoveProductDto } from '../dto';
import { CampaignService } from '../services';

@Controller()
export class ProductMessageBusController {

  private logger: Logger = new Logger(ProductMessageBusController.name, true);
  constructor(
    private campaignService: CampaignService,
    private loggerInject: Logger,
  ) {
  }

  @MessagePattern({
    name: RabbitBinding.ProductRemoved,
  })
  public async onProductRemoved(data: RemoveProductDto): Promise<void> {
    this.logger.log('Remove products rabbit event');
    this.logger.log(data);
    await this.campaignService.removeProductId(data.productIds);
  }
}
