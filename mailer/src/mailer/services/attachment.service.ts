import { AttachmentDto, EventAttachmentDto } from '../dto';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';
import { AttachmentInterface } from '../interfaces/attachment.interface';

type GetFileResponseType = {
  content: any;
  name: string;
};

@Injectable()
export class AttachmentService {
  public static getFiles(files: any[]): Promise<AttachmentDto[]> {
    return new Promise((
      resolve: (value?: AttachmentDto[] | PromiseLike<AttachmentDto[]>) => void,
      reject: (reason?: Error) => void,
    ) => {
      const result: AttachmentDto[] = [];
      const promises: Array<Promise<GetFileResponseType>> = [];

      for (const file of files) {
        promises.push(AttachmentService.getFile(file));
      }

      Promise.all(promises).then((responses: GetFileResponseType[]) => {
        for (const response of responses) {
          result.push(AttachmentService.formatResponse(response));
        }

        resolve(result);
      }).catch((err: Error) => reject(err));
    });
  }

  private static formatResponse(response: GetFileResponseType): AttachmentDto {
    const dto: AttachmentDto = new AttachmentDto();

    dto.content = response.content;
    dto.filename = response.name;

    return dto;
  }

  private static getFile(file: any): Promise<GetFileResponseType> {
    const agent: https.Agent = new https.Agent({
      rejectUnauthorized: false,
    });

    return new Promise((
      resolve: (value?: GetFileResponseType) => void,
      reject: (reason?: Error) => void,
    ) => {
      // tslint:disable-next-line: no-floating-promises
      axios.get(encodeURI(file.url), { httpsAgent: agent, responseType: 'arraybuffer' })
        .then((x: any) => {
          resolve({
            content: x.data,
            name: file.name,
          });
        });
    });
  }

  public static getFromBase64Files(attachments: AttachmentInterface[]): AttachmentDto[] {
    const result: AttachmentDto[] = [];
    for (const attachment of attachments) {
      const attachmentDto: AttachmentDto = new AttachmentDto();
      attachmentDto.content = attachment.binaryContent;
      attachmentDto.filename = attachment.name;
      attachmentDto.cid = attachment.name;
      result.push(attachmentDto);
    }

    return result;
  }

  public static getFromBase64FilesEvent(attachments: EventAttachmentDto[]): AttachmentDto[] {
    const result: AttachmentDto[] = [];
    for (const attachment of attachments) {
      const attachmentDto: AttachmentDto = new AttachmentDto();
      attachmentDto.content = attachment.content;
      attachmentDto.filename = attachment.filename;
      attachmentDto.cid = attachment.filename;
      attachmentDto.encoding = attachment.encoding;
      result.push(attachmentDto);
    }

    return result;
  }

}
