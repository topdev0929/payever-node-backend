import { AttachmentInterface } from './attachment.interface';

export interface CampaignInterface {
  id: string;
  themeId?: string;
  business: string;
  categories?: string[];
  channelSet: string;
  from?: string;
  theme?: string;
  name: string;
  preview?: string;
  contacts?: string[];
  date: Date;
  schedules?: string[];
  status: string;
  attachments?: AttachmentInterface[];
  template?: string;
  productIds?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
