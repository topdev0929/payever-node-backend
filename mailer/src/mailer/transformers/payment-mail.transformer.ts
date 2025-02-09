import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { MailDto, PaymentMailDto, RenderedMailDto, AttachmentDto } from '../dto';
import { BankAccountInterface, BusinessInterface } from '../interfaces';
import { AttachmentService, EmailRenderer } from '../services';
import { RecipientsTransformer } from './recipients.transformer';
import { MailParamsTransformer } from './mail-params.transformer';
import { ServerTypeEnum } from '../enum';

@Injectable()
export class PaymentMailTransformer {
  constructor(
    @Inject(forwardRef(() => EmailRenderer))
    private readonly renderer: EmailRenderer,
  ) { }

  public async transform(
    paymentDto: PaymentMailDto,
    business?: BusinessInterface,
    bankAccount?: BankAccountInterface,
  ): Promise<MailDto> {
    const params: any = await MailParamsTransformer.transform(paymentDto, business, bankAccount);

    const renderedEmail: RenderedMailDto = await this.renderer.render(paymentDto.template_name, params);

    const dto: MailDto = new MailDto();
    dto.subject = renderedEmail.subject;
    dto.html = renderedEmail.html;

    Object.assign(dto, RecipientsTransformer.getRecipients(paymentDto, business));

    if (renderedEmail.attachments) {
      dto.attachFiles(AttachmentService.getFromBase64Files(renderedEmail.attachments));
    }

    if (paymentDto.attachments) {
      dto.attachFiles(AttachmentService.getFromBase64FilesEvent(paymentDto.attachments));
    }

    if (paymentDto.variables && paymentDto.variables.files) {
      dto.attachFiles(await AttachmentService.getFiles(paymentDto.variables.files));
    }

    dto.serverType = paymentDto.server_type || ServerTypeEnum.payever;

    return dto;
  }
}
