import { MessageResponseInterface } from './message-response.interface';

export interface BusinessDefaultSiteDataResponseInterface extends MessageResponseInterface {
  id: string;
  siteId?: string;
  siteName?: string;
  siteLogo?: string;
  siteUrl?: string;
}
