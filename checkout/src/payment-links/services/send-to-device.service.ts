import { Injectable } from '@nestjs/common';
import { IntercomService, RabbitMqClient } from '@pe/nest-kit';
import { BusinessService } from '@pe/business-kit';
import { ConnectionService } from '../../connection/services';
import { CheckoutDbService, CheckoutIntegrationSubscriptionService } from '../../common/services';
import { PaymentLinkModel } from '../models';
import { SendToDeviceRequestDto } from '../dto/request/send-to-device-request.dto';

@Injectable()
export class SendToDeviceService {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async sendToDevice(
    paymentLinkModel: PaymentLinkModel,
    sendToDeviceRequestDto: SendToDeviceRequestDto,
  ): Promise<void> {
    await this.sendEmail(sendToDeviceRequestDto);
  }

  private async sendEmail(sendToDeviceRequestDto: SendToDeviceRequestDto): Promise<void> {
    if (!sendToDeviceRequestDto.email) {
      return;
    }

    await this.rabbitClient.send(
      {
        channel: 'payever.event.mailer.send',
        exchange: 'async_events',
      },
      {
        name: 'payever.event.mailer.send',
        payload: {
          html: sendToDeviceRequestDto.message,
          subject: sendToDeviceRequestDto.subject,
          to: sendToDeviceRequestDto.email,
        },
      },
    );
  }
}
