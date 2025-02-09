import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { MailDto, RenderedMailDto, InvoiceMailDto } from '../dto';
import { BankAccountInterface, BusinessInterface } from '../interfaces';
import { AttachmentService, EmailRenderer } from '../services';
import { ServerTypeEnum } from '../enum';

@Injectable()
export class InvoiceMailTransformer {
  constructor(
    @Inject(forwardRef(() => EmailRenderer))
    private readonly renderer: EmailRenderer,
  ) { }

  public async transform(
    invoiceMailDto: InvoiceMailDto,
    business?: BusinessInterface,
    bankAccount?: BankAccountInterface,
  ): Promise<MailDto> {

    invoiceMailDto.business = business;
    invoiceMailDto.bankAccount = bankAccount;

    const renderedEmail: RenderedMailDto =
      await this.renderer.render(invoiceMailDto.template_name, invoiceMailDto);

    const dto: MailDto = new MailDto();
    dto.subject = renderedEmail.subject;
    dto.html = renderedEmail.html;
    dto.to = invoiceMailDto.to;

    if (renderedEmail.attachments) {
      dto.attachFiles(AttachmentService.getFromBase64Files(renderedEmail.attachments));
    }

    if (invoiceMailDto.variables && invoiceMailDto.variables.files) {
      dto.attachFiles(await AttachmentService.getFiles(invoiceMailDto.variables.files));
    }

    dto.serverType = invoiceMailDto.serverType || ServerTypeEnum.payever;

    return dto;
  }
}
