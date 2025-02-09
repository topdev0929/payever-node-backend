import { Injectable } from '@nestjs/common';
import { SingleMailDto, MailDto, RenderedMailDto } from '../dto';
import { SenderService } from './sender.service';
import { SingleMailTransformer } from '../transformers';
import { AttachmentService, EmailRenderer } from '.';
import { environment } from '../../environments';
import { ServerTypeEnum } from '../enum';

@Injectable()
export class SingleMailService {
  constructor(
    private readonly singleMailTransformer: SingleMailTransformer,
    private readonly sendService: SenderService,
    private readonly renderer: EmailRenderer,
  ) { }

  public async send(singleMailDto: SingleMailDto): Promise<void> {
    const mailDto: MailDto = SingleMailTransformer.transform(singleMailDto);
    if (singleMailDto.type) {
      const renderedEmail: RenderedMailDto = await this.renderer.render(singleMailDto.type, {
        ...singleMailDto.params,
        _env: {
          commerseOSUrl: environment.commerseOSUrl,
        },
      });
      mailDto.html = renderedEmail.html;
      mailDto.subject = mailDto.subject || renderedEmail.subject;
      if (renderedEmail.attachments) {
        mailDto.attachFiles(AttachmentService.getFromBase64Files(renderedEmail.attachments));
      }
    }
    mailDto.serverType = singleMailDto.server_type || ServerTypeEnum.payever;

    await this.sendService.send(mailDto);
  }
}
