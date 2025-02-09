import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

import { BankAccountInterface, BusinessInterface } from '../interfaces';
import { MailDto, InvoiceMailDto } from '../dto';
import { SenderService } from './sender.service';
import { BusinessSchemaName, BankAccountSchemaName } from '../schemas';
import { InvoiceMailTransformer } from '../transformers';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(BankAccountSchemaName) private readonly bankAccountModel: Model<BankAccountInterface>,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessInterface & Document>,
    private readonly invoiceMailTransformer: InvoiceMailTransformer,
    private readonly sendService: SenderService,
  ) { }

  public async sendInvoiceEmail(invoiceMail: InvoiceMailDto): Promise<void> {
    const [bankAccount, business]: [BankAccountInterface, BusinessInterface] = await Promise.all([
      this.bankAccountModel.findOne({ business_id: invoiceMail.invoice.businessId }),
      this.businessModel.findOne({ _id: invoiceMail.invoice.businessId }).populate('owner'),
    ]);

    const dto: MailDto = await this.invoiceMailTransformer.transform(invoiceMail, business, bankAccount);

    await this.sendService.send(dto);
  }
}
