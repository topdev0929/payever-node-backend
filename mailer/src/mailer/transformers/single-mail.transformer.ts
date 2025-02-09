import { plainToClass } from 'class-transformer';
import { Injectable } from '@nestjs/common';

import { MailDto, SingleMailDto, AttachmentDto, SingleMailAttachmentDto } from '../dto';

@Injectable()
export class SingleMailTransformer {
  constructor(
  ) { }

  public static transform(singleMailDto: SingleMailDto): MailDto {
    return plainToClass(MailDto, {
      to: singleMailDto.to,

      bcc: [],
      cc: singleMailDto.cc || [],

      html: singleMailDto.html,
      subject: singleMailDto.subject,

      attachments: (singleMailDto.attachments || []).map((attachmentDto: SingleMailAttachmentDto) => {
        const attachment: AttachmentDto = new AttachmentDto();
        attachment.contentType = attachmentDto.contentType;
        attachment.filename = attachmentDto.filename;
        attachment.content = this.parseContent(attachmentDto.content);
        attachment.encoding = attachmentDto.encoding;

        return attachment;
      }),
    } as MailDto);
  }

  private static parseContent(
    data: string | ReturnType<Buffer['toJSON']>,
  ): string | Buffer {
    if (typeof data === 'string') {
      return data;
    }
    if (data?.type === 'Buffer' && Array.isArray(data?.data)) {
      return Buffer.from(data as any);
    }

    throw new Error('Invalid attachment content');
  }
}
