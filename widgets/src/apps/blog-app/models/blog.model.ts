import { BlogInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface BlogModel extends  BlogInterface, Document { }
