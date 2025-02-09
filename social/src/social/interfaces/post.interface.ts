import { BusinessInterface } from '../../business';
import { ChannelSetInterface } from '../../channel-set';
import { MediaTypeEnum, PostSentStatusEnum, PoststatusEnum, PostTypeEnum } from '../enums';
import { MediaInterface } from './media.interface';
import { PostStateInterface } from './post-state.interface';

export interface PostInterface {
  title: string;
  content: string;
  media?: string[];
  postState: PostStateInterface[];
  products?: string[];
  attachments?: MediaInterface[];
  failedIntegrations?: string[];
  mediaType: MediaTypeEnum;
  channelSet: ChannelSetInterface[] | string[];
  business?: BusinessInterface;
  businessId: string;
  sentStatus: PostSentStatusEnum;
  status: PoststatusEnum;
  toBePostedAt?: Date;
  type: PostTypeEnum;
  postedAt?: Date;
  parentFolderId?: string;
  productId?: string[];
}
