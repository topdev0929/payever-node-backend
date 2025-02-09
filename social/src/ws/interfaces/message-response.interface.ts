import { PostModel } from '../../social';

export interface MessageResponseInterface {
  name: string;
  id?: string;
  data?: PostModel;
  result: boolean;
}
