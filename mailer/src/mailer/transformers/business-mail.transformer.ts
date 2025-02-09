import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { BusinessMailDto, MailDto, RenderedMailDto } from '../dto';
import { AttachmentService, EmailRenderer } from '../services';
import { BusinessInterface, UserInterface } from '../interfaces';
import * as Case from 'case';

@Injectable()
export class BusinessMailTransformer {
  constructor(
    @Inject(forwardRef(() => EmailRenderer))
    private readonly renderer: EmailRenderer,
  ) { }

  public async transform(
    businessMailDto: BusinessMailDto,
    business: BusinessInterface,
    owner: UserInterface,
  ): Promise<MailDto> {
    if (owner && owner.userAccount) {
      owner.userAccount.firstName = Case.capital(owner.userAccount.firstName);
      owner.userAccount.lastName = Case.capital(owner.userAccount.lastName);
    }

    businessMailDto.setLocale(business);

    const params: any = Object.assign(
      businessMailDto.variables || { },
      {
        business: business,
        owner: owner,
      },
    );
    params.locale = businessMailDto.locale;

    const renderedEmail: RenderedMailDto = await this.renderer.render(businessMailDto.templateName, params);

    const dto: MailDto = new MailDto();
    dto.subject = renderedEmail.subject;
    dto.html = renderedEmail.html;

    const mailTo: string = businessMailDto.to ? businessMailDto.to :
      business.contactEmails && business.contactEmails.length
      ? business.contactEmails[0]
      : owner?.userAccount?.email;
    Object.assign(dto, { to: mailTo });

    if (businessMailDto.bcc) {
      dto.bcc = businessMailDto.bcc;
    }

    if (renderedEmail.attachments) {
      dto.attachFiles(AttachmentService.getFromBase64Files(renderedEmail.attachments));
    }

    if (businessMailDto.variables && businessMailDto.variables.files) {
      dto.attachFiles(await AttachmentService.getFiles(businessMailDto.variables.files));
    }

    return dto;
  }
}
