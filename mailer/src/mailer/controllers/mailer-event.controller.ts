import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import {
  BusinessService,
  PaymentService,
  SingleMailService,
  PaymentMailService,
  CampaignMailService,
  UserService,
  InvoiceService,
} from '../services';
import { BusinessMailDto, CampaignMailDto, PaymentMailDto, SingleMailDto, UserMailDto, InvoiceMailDto } from '../dto';
import { PaymentMailModel } from '../models';

@Controller()
export class MailerEventController {
  constructor(
    private readonly singleMailService: SingleMailService,
    private readonly paymentService: PaymentService,
    private readonly businessService: BusinessService,
    private readonly logger: Logger,
    private readonly sentPaymentMailService: PaymentMailService,
    private readonly campaignMailService: CampaignMailService,
    private readonly userService: UserService,
    private readonly invoiceService: InvoiceService,
  ) { }

  @MessagePattern({
    name: 'mail.event.campaign.send',
  })
  public async onCampaignSend(unwrapped: { }): Promise<any> {
    const sendRequestDto: CampaignMailDto = plainToClass<CampaignMailDto, { }>(CampaignMailDto, unwrapped);

    return this.campaignMailService.send(sendRequestDto);
  }

  @MessagePattern({
    name: 'payever.event.mailer.send',
  })
  public async onSingleMailSend(unwrapped: { }): Promise<void> {
    try {
      this.logger.log({
        message: 'Start processing single mail event',
        unwrapped_data: JSON.stringify(unwrapped),
      });

      const sendRequestDto: SingleMailDto = plainToClass<SingleMailDto, { }>(SingleMailDto, unwrapped);

      await this.singleMailService.send(sendRequestDto);
    } catch (e) {
      this.logger.warn({
        error: e.message,
        message: 'Failed to send single mail',
        unwrapped,
      });
    }
  }

  @MessagePattern({
    name: 'payever.event.payment.email',
  })
  public async onPaymentMailSend(unwrapped: { }): Promise<void> {
    try {
      this.logger.log({
        message: 'Start processing payment mail event',
        unwrapped_data: JSON.stringify(unwrapped),
      });

      const paymentMailDto: PaymentMailDto = plainToClass<PaymentMailDto, { }>(PaymentMailDto, unwrapped);

      const paymentMail: PaymentMailModel = await this.sentPaymentMailService.save({
        eventData: paymentMailDto,
        templateName: paymentMailDto.template_name,
        transactionId: paymentMailDto?.payment?.uuid,
      });

      await this.paymentService.sendPaymentEmail(paymentMail);
    } catch (e) {
      this.logger.warn({
        error: e.message,
        message: 'Failed to send payment mail',
        unwrapped,
      });
    }
  }

  @MessagePattern({
    name: 'payever.event.business.email',
  })
  public async onBusinessMailSend(unwrapped: { }): Promise<void> {
    try {
      this.logger.log({
        message: 'Start processing business mail event',
        unwrapped_data: JSON.stringify(unwrapped),
      });

      const businessMailDto: BusinessMailDto = plainToClass<BusinessMailDto, { }>(BusinessMailDto, unwrapped);
      if (
        businessMailDto.variables &&
        businessMailDto.variables.message &&
        typeof businessMailDto.variables.message === 'object'
      ) {
        businessMailDto.variables.message = JSON.stringify(businessMailDto.variables.message);
      }

      await this.businessService.sendBusinessEmail(businessMailDto);
    } catch (e) {
      this.logger.warn({
        error: e.message,
        message: 'Failed to send business mail',
        unwrapped,
      });
    }
  }

  @MessagePattern({
    name: 'payever.event.user.email',
  })
  public async onUserMailSend(unwrapped: { }): Promise<void> {
    try {
      this.logger.log({
        message: 'Start processing user mail event',
        unwrapped_data: JSON.stringify(unwrapped),
      });

      const userMailDto: UserMailDto = plainToClass<UserMailDto, { }>(UserMailDto, unwrapped);

      await this.userService.sendUserEmail(userMailDto);
    } catch (e) {
      this.logger.warn({
        error: e.message,
        message: 'Failed to send user mail',
        unwrapped,
      });
    }
  }

  @MessagePattern({
    name: 'payever.event.invoice.email',
  })
  public async onInvoiceMailSend(unwrapped: { }): Promise<void> {
    try {
      this.logger.log({
        message: 'Start processing invoice mail event',
        unwrapped_data: JSON.stringify(unwrapped),
      });

      const invoiceMailDto: InvoiceMailDto = plainToClass<InvoiceMailDto, { }>(InvoiceMailDto, unwrapped);

      await this.invoiceService.sendInvoiceEmail(invoiceMailDto);
    } catch (e) {
      this.logger.warn({
        error: e.message,
        message: 'Failed to send payment mail',
        unwrapped,
      });
    }
  }

}
