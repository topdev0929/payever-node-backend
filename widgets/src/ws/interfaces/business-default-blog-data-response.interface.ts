import { MessageResponseInterface } from './message-response.interface';

export interface BusinessDefaultBlogDataResponseInterface extends MessageResponseInterface {
  id: string;
  blogId?: string;
  blogName?: string;
  blogLogo?: string;
}
