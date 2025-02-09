import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { EventDispatcher } from '@pe/nest-kit';
import { EventsEnum, RabbitRoutingKeysEnum } from '../enum';
import { BusinessSynchronizerService } from '../services';

@Controller()
export class PaymentEventsController {
  constructor(
    private readonly businessSyncrhonizerService: BusinessSynchronizerService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @MessagePattern({
    name: RabbitRoutingKeysEnum.PaymentCreated,
  })
  public async onPaymentCreated(dto: any): Promise<void> {
    await this.businessSyncrhonizerService.registerTransactionInCrmContact(
      dto.payment.business.uuid,
      dto.payment.total_base_currency,
    );

    await this.eventDispatcher.dispatch(EventsEnum.TransactionCreated, dto.payment);
  }
}
