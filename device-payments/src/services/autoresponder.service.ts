import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { plainToClass } from 'class-transformer';
import { Model } from 'mongoose';

import { AutoResponderDto, PaymentCodeCreateDto } from '../dto';
import { PaymentSource } from '../enum';
import { environment } from '../environments';
import { ApplicationModel, BusinessModel, CheckoutModel, PaymentCode } from '../interfaces';
import { ApplicationSchemaName, BusinessSchemaName, CheckoutSchemaName } from '../schemas';
import { CommunicationsService } from './communications.service';
import { PaymentService } from './payment.service';

@Injectable()
export class AutoresponderService {
  constructor(
    private readonly logger: Logger,
    @InjectModel(ApplicationSchemaName) private readonly applicationModel: Model<ApplicationModel>,
    @InjectModel(CheckoutSchemaName) private readonly checkoutModel: Model<CheckoutModel>,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly paymentService: PaymentService,
  ) { }

  public async autoRespond(dto: AutoResponderDto): Promise<{ message: string }> {
    const { amount, keyword }: { amount: number; keyword: string } = AutoresponderService.parseMessage(dto.message);

    if (isNaN(amount)) {
      const errorMessage: string = `Invalid amount received in SMS: ${dto.message}`;
      this.logger.warn(errorMessage);

      return { message: errorMessage };
    }

    const application: ApplicationModel = await this.getApplication(String(+dto.to), keyword);
    if (!application) {
      const errorMessage: string = 'An application with a phone number ' + dto.to +
        (keyword ? ` and a keyword ${keyword}` : '') +
        ' is' + ' not configured.';
      this.logger.warn(errorMessage);

      return { message: errorMessage };
    }

    const business: BusinessModel = await this.businessModel.findOne({ _id: application.businessId }).exec();
    if (!(business && business.settings && business.settings.autoresponderEnabled)) {
      throw new InternalServerErrorException(
        `Autoresponder is disabled on account with business id ${application.businessId}
      `);
    }

    const paymentCode: PaymentCode = await this.paymentService.createPaymentCodeByTerminal(
      application,
      PaymentSource.autoresponder,
      plainToClass(PaymentCodeCreateDto, { phoneNumber: dto.from }),
    );
    const mediaDataDto: any = {
      data: {
        flow: {
          amount: Number(amount),
          channel_set_id: application.channelSetId,
        },
        phoneNumber: dto.from,

        code_id: paymentCode._id,
        force_no_order: true,
        generate_payment_flow: true,
      },
      expiresAt: new Date(new Date().getTime() + (60 * 60 * 24 * 1000)).toISOString(), // data expire in one day
    };

    const mediaResponse: any = await axios.post(`${environment.mediaUrl}/api/storage`, mediaDataDto);

    const mediaDataId: any = mediaResponse.data.id;
    const url: string = `${environment.checkoutWrapper}/pay/restore-flow-from-code/${mediaDataId}`;

    return { message: CommunicationsService.generateMessage(application, url) };
  }

  private async getApplication(phoneNumber: string, keyword: string): Promise<ApplicationModel> {
    const checkout: CheckoutModel = await this.checkoutModel.findOne({ phoneNumber, keyword }).exec();
    if (!checkout) {
      return;
    }

    return this.applicationModel
      .findOne({ checkout: checkout._id })
      .populate('checkout');
  }

  private static parseMessage(message: string): { amount: number; keyword: string } {
    const [amount, keyword]: string[] = message.split(' ').reverse();

    return { amount: +amount, keyword };
  }
}
