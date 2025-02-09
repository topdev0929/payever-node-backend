import { Document } from 'mongoose';
import { BlogPageInterface } from '../interfaces';
import { BlogModel } from './blog.model';

export interface BlogPageModel extends BlogPageInterface, Document {
  blog: BlogModel | string;
}
