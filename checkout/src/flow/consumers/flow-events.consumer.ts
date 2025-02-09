import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitBinding, MessageBusChannelsEnum } from '../../environments';
import { PaymentFlowWrapperDto } from '../dto';
import { FlowService } from '../services';

@Controller()
export class FlowEventsConsumer {
  constructor(
    private readonly flowService: FlowService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.PaymentFlowMigrate,
  })
  public async onPaymentFlowMigrateEvent(data: PaymentFlowWrapperDto): Promise<void> {
    try {
      await this.flowService.createFlowFromMigrateEvent(data.flow);
    } catch (e) {
      this.logger.warn(
        {
          error: e.message,
          message: 'Failed to create flow from migrate event',
        },
        'FlowEventsConsumer',
      );
    }
  }
}
