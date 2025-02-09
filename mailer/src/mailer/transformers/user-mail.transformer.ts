import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserMailDto, MailDto, RenderedMailDto } from '../dto';
import { AttachmentService, EmailRenderer } from '../services';

@Injectable()
export class UserMailTransformer {
  constructor(
    @Inject(forwardRef(() => EmailRenderer))
    private readonly renderer: EmailRenderer,
  ) { }

  public async transform(
    adminMailDto: UserMailDto,
  ): Promise<MailDto> {
    const params: any = Object.assign(adminMailDto.variables || { });

    params.locale = adminMailDto.locale ? adminMailDto.locale : 'en';
    const renderedEmail: RenderedMailDto = await this.renderer.render(adminMailDto.templateName, params);
    const dto: MailDto = new MailDto();
    dto.subject = renderedEmail.subject;
    dto.html = renderedEmail.html;
    Object.assign(dto, { to: adminMailDto.to });

    if (renderedEmail.attachments) {
      dto.attachFiles(AttachmentService.getFromBase64Files(renderedEmail.attachments));
    }

    if (adminMailDto.variables && adminMailDto.variables.files) {
      dto.attachFiles(await AttachmentService.getFiles(adminMailDto.variables.files));
    }

    return dto;
  }
}
