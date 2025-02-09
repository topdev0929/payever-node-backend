import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { MongooseModel } from '../enum';
import { InvoiceModel } from '../models';

@Injectable()
export class InvoiceService {

  constructor(
    @InjectModel(MongooseModel.Invoice)
      private readonly invoiceModel: Model<InvoiceModel>,
  ) { }

  public async createInvoice(id: string, business: BusinessModel, amountPaid: number): Promise<void> {
    await this.invoiceModel.create({ _id: id, currency: business.currency, amountPaid });
  }

  public async updateAmountPaid(id: string, amountPaid: number): Promise<InvoiceModel> {
    return this.invoiceModel.findOneAndUpdate(
      { _id: id }, 
      { $set: { amountPaid } },
    );
  }

  public async findOneById(id: string): Promise<InvoiceModel> {
    return this.invoiceModel.findById(id);
  }

  public async removeById(id: string): Promise<InvoiceModel> {
    return this.invoiceModel.findByIdAndRemove(id);
  }
}
