import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CreateInvoiceDto } from '../dto';
import { CreateDraftInvoiceResponseInterface, InvoiceResponseInterface } from '../interfaces/';

@Injectable()
export class AccountingsApiService {
  constructor() { }

  public async getInvoice(url: string, invoiceId: string): Promise<InvoiceResponseInterface> {
    const res: { data: InvoiceResponseInterface } = await axios({
      method: 'get',
      url: `${url}/invoice/${invoiceId}`,
    });

    return res.data;
  }

  public async createInvoice(url: string, invoice: CreateInvoiceDto): Promise<CreateDraftInvoiceResponseInterface> {
    const res: { data: CreateDraftInvoiceResponseInterface } = await axios({
      data: invoice,
      method: 'post',
      url: `${url}/invoices`,
    });

    return res.data;
  }

  public async bookInvoice(url: string, invoiceId: string): Promise<any> {
    const res: { data: any } = await axios({
      method: 'post',
      url: `${url}/invoices/book/${invoiceId}`,
    });

    return res.data;
  }

  // tslint:disable-next-line:no-identical-functions
  public async deleteInvoice(url: string, invoiceId: string): Promise<any> {
    const res: { data: any } = await axios({
      method: 'delete',
      url: `${url}/invoices/book/${invoiceId}`,
    });

    return res.data;
  }
}
