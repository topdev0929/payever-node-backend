import { Document, Types } from 'mongoose';
import { BlogAccessConfigInterface } from '../interfaces';
import { BlogModel } from '.';

export interface BlogAccessConfigModel extends BlogAccessConfigInterface, Document {
  blog: BlogModel;
}
