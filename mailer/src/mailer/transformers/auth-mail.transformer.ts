import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ApplicationAccessRequestDto, MailDto, RenderedMailDto } from '../dto';
import { AttachmentService, EmailRenderer } from '../services';
import { ApplicationAccessStatusEnum } from '@pe/nest-kit';
import { environment } from '../../environments';
import { ServerTypeEnum } from '../enum';

@Injectable()
export class AuthMailTransformer {
  constructor(
    @Inject(forwardRef(() => EmailRenderer))
    private readonly renderer: EmailRenderer,
  ) { }

  public async applicationAccessRequestToMailDto(
    templateName: string,
    applicationAccessRequestDto: ApplicationAccessRequestDto,
  ): Promise<MailDto> {
    const params: ApplicationAccessRequestDto & { url?: string } = Object.assign({ ...applicationAccessRequestDto });

    let to: string = '';

    if (
      applicationAccessRequestDto.status === ApplicationAccessStatusEnum.APPROVED ||
      applicationAccessRequestDto.status === ApplicationAccessStatusEnum.DENIED
    ) {
      to = applicationAccessRequestDto.customer.email;
      params.url = `${environment.commerseOSUrl}`;
    } else {
      to = applicationAccessRequestDto.business.contactEmails?.join('; ') || applicationAccessRequestDto.owner.email;
      params.url = `${environment.commerseOSUrl}/business/${applicationAccessRequestDto.business.id}/contacts`;
    }

    const renderedEmail: RenderedMailDto = await this.renderer.render(templateName, params);
    const dto: MailDto = new MailDto();
    dto.subject = renderedEmail.subject;
    dto.html = renderedEmail.html;
    Object.assign(dto, { to: to });

    if (renderedEmail.attachments) {
      dto.attachFiles(AttachmentService.getFromBase64Files(renderedEmail.attachments));
    }

    dto.serverType = applicationAccessRequestDto.serverType || ServerTypeEnum.payever;

    return dto;
  }
}
