import { RabbitMqClient } from '@pe/nest-kit';
import { BusinessService } from '@pe/business-kit';
import { ChannelSubTypeEnum } from '../enum';
import { ApiCallPaymentCreateDto, PaymentMailDto } from '../dto';
import { RabbitBinding } from '../../environments';
import { Injectable } from '@nestjs/common';
import { BusinessModel } from '@pe/business-kit/modules';

@Injectable()
export class SendEmailService {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly businessService: BusinessService,
  ) { }

  public async sendPaymentRedirectUrlEmail(
    apiCallPaymentCreateDto: ApiCallPaymentCreateDto,
    redirectUrl: string,
    businessId: string,
  ): Promise<void> {
    if (!(apiCallPaymentCreateDto.channel_type === ChannelSubTypeEnum.Email && apiCallPaymentCreateDto.email)) {
      return;
    }
    const business: BusinessModel = await this.businessService.findOneById(businessId);
    const subject: string = apiCallPaymentCreateDto?.link_message?.subject
      ? apiCallPaymentCreateDto.link_message.subject
      : `Payment of ${apiCallPaymentCreateDto.amount} to ${business.name}`;

    const emailContent: string = apiCallPaymentCreateDto?.link_message?.content
      ? apiCallPaymentCreateDto.link_message.content
      : null;

    let variables: any = {
      businessName: business.name,
      orderId: apiCallPaymentCreateDto.order_id,
      redirectUrl,
    };

    if (emailContent) {
      variables = {
        ...variables,
        emailContent,
      };
    }

    const emailData: PaymentMailDto = {
      locale: 'en',
      subject: subject,
      templateName: 'checkout.finalize_payment',
      to: apiCallPaymentCreateDto.email,
      variables,
    };

    await this.sendEmailEvent(RabbitBinding.PayeverEventUserEmail, emailData);
  }

  public async sendPayment2faPinEmail(
    customerEmail: string,
    pin: number,
  ): Promise<void> {
    const emailData: PaymentMailDto = {
      templateName: 'payment.verify.pin',
      to: customerEmail,
      variables: {
        pin,
      },
    };

    await this.sendEmailEvent(RabbitBinding.PayeverEventUserEmail, emailData);
  }

  private async sendEmailEvent(channel: string, emailData: any): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: channel,
        exchange: 'async_events',
      },
      {
        name: channel,
        payload: emailData,
      },
    );
  }
}

