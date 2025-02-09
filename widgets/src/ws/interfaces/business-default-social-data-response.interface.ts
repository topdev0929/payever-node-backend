import { ChannelSetInterface, SocialPostModel } from '../../apps/social-app';
import { MessageResponseInterface } from './message-response.interface';

export interface BusinessDefaultSocialDataResponseInterface extends MessageResponseInterface {
  id: string;
  posts?: SocialPostModel[];
}
