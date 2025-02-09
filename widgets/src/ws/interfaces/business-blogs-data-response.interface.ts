import { BlogModel } from '../../apps/blog-app';
import { MessageResponseInterface } from './message-response.interface';

export interface BusinessBlogsDataResponseInterface extends MessageResponseInterface {
  id: string;
  blogs?: BlogModel[];
}
