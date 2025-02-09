import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { RabbitRoutingKeys, RabbitChannels } from '../enum';
import { PaymentMailSentDto } from '../dto';
import { PaymentsService } from '../services';

@Controller()
export class MailerBusMessagesController {
  constructor(
    private readonly logger: Logger,
    private readonly paymentsService: PaymentsService,
  ) { }

  @MessagePattern({
    channel: RabbitChannels.connect,
    name: RabbitRoutingKeys.MailerPaymentMailSent,
  })
  public async onPaymentMailSent(data: any): Promise<void> {
    this.logger.log({
      eventData: JSON.stringify(data),
      message: 'Start processing payment mail sent event',
    });

    const paymentMailSent: PaymentMailSentDto = plainToClass(PaymentMailSentDto, data);

    await this.paymentsService.clearPayloadDocuments(paymentMailSent);
  }
}
