import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business';

import {
  InvoiceDto,
} from '../dto';
import { InvoiceModel } from '../models';
import { 
    InvoiceBusinessIncomeService,
    InvoiceService, 
} from '../services';

@Controller()
export class InvoiceBusMessageController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly businessIncomeService: InvoiceBusinessIncomeService,
    private readonly invoiceService: InvoiceService,
  ) {
  }

  @MessagePattern({
    name: 'invoice.event.invoice.created',
  })
  public async onInvoiceCreatedEvent(data: InvoiceDto): Promise<void> {
    await this.add(data.businessId, data.invoiceId, data.updatedAt, data.amountPaid);
  }

  @MessagePattern({
    name: 'invoice.event.invoice.updated',
  })
  public async onInvoiceUpdatedEvent(data: InvoiceDto): Promise<void> {

    const invoice: InvoiceModel = await this.invoiceService.findOneById(data.invoiceId);

    await this.subtract(data.businessId, data.invoiceId, data.updatedAt, invoice.amountPaid);
    await this.add(data.businessId, data.invoiceId, data.updatedAt, data.amountPaid);

    await this.invoiceService.updateAmountPaid(data.invoiceId, data.amountPaid);
  }

  @MessagePattern({
    name: 'invoice.event.invoice.deleted',
  })
  public async onInvoiceRemovedEvent(data: InvoiceDto): Promise<void> {

    await this.subtract(data.businessId, data.invoiceId, data.updatedAt, data.amountPaid);

  }

  @MessagePattern({
    name: 'invoice.event.invoice.export',
  })
  public async onInvoiceExportedEvent(data: InvoiceDto): Promise<void> {
    await this.add(data.businessId, data.invoiceId, data.updatedAt, data.amountPaid);
  }

  private async add(businessId: string, invoiceId: string, date: string, amountPaid: number): Promise<void> {
    const business: BusinessModel = await this.businessService
    .findOneById(businessId) as unknown as BusinessModel;

    if (!business) {
      return;
    }

    await this.businessIncomeService.add(business, new Date(date), amountPaid);
    await this.invoiceService.createInvoice(invoiceId, business, amountPaid);
  }

  private async subtract(businessId: string, invoiceId: string, date: string, amountPaid: number): Promise<void> {
    const business: BusinessModel = await this.businessService
    .findOneById(businessId) as unknown as BusinessModel;

    if (!business) {
      return;
    }

    await this.businessIncomeService.subtract(business, new Date(date), amountPaid);
    await this.invoiceService.removeById(invoiceId);
  }

}
