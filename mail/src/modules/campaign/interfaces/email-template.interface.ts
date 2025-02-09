import { AttachmentInterface } from '.';

export interface EmailTemplateInterface {
  attachments?: AttachmentInterface[];
  html: string;
}
