import { UserMediaAttributeInterface } from './user-media-attribute-interface';

export interface UserAlbumInterface {
  ancestors?: string[];
  businessId: string;
  description?: string;
  icon?: string;
  name: string;
  parent?: string;
  userAttributes?: UserMediaAttributeInterface[];
  hasChildren?: boolean;
}
