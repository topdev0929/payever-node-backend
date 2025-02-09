import { SocialTypeEnum } from '../enums';

export interface SocialInterface {
  blocked?: boolean;
  email: string;
  name: string;
  socialId: string;
  type: SocialTypeEnum;
  userId: string;
}
