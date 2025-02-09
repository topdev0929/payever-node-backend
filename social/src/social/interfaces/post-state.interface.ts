import { PostStatusEnum } from '../enums';
import { PostStateErrorInterface } from './post-state-error.interface';

export interface PostStateInterface {
  status: PostStatusEnum;
  intergrationName: string;
  postId: string;
  error?: PostStateErrorInterface;
}
