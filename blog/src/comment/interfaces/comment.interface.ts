import { BaseCommentInterface } from './base-comment.interface';
import { BlogInterface } from '../../blog/interfaces';

export interface CommentInterface extends BaseCommentInterface {
  content: string;
  author?: string;
  blog: BlogInterface;
  createdAt?: Date;
  updatedAt?: Date;
}
