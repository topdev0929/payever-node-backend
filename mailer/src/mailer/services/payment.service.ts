import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

import { BankAccountInterface, BusinessInterface } from '../interfaces';
import { MailDto } from '../dto';
import { SenderService } from './sender.service';
import { PaymentMailTransformer } from '../transformers';
import { BusinessSchemaName, BankAccountSchemaName } from '../schemas';
import { PaymentMailModel } from '../models';
import { MailerEventsProducer } from '../producers';
import { AttachmentService } from './attachment.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(BankAccountSchemaName) private readonly bankAccountModel: Model<BankAccountInterface>,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessInterface & Document>,
    private readonly paymentMailTransformer: PaymentMailTransformer,
    private readonly sendService: SenderService,
    private readonly eventProducer: MailerEventsProducer,
  ) { }

  public async sendPaymentEmail(paymentMail: PaymentMailModel): Promise<void> {
    const [bankAccount, business]: [BankAccountInterface, BusinessInterface] = await Promise.all([
      this.bankAccountModel.findOne({ business_id: paymentMail.eventData.business.uuid }),
      this.businessModel.findOne({ _id: paymentMail.eventData.business.uuid }).populate('owner'),
    ]);

    const dto: MailDto = await this.paymentMailTransformer.transform(paymentMail.eventData, business, bankAccount);

    await this.sendService.send(dto);

    await this.eventProducer.producePaymentMailSentEvent(paymentMail);
  }
}
