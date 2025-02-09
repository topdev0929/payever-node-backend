import { DefaultCategoryInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface DefaultCategoryModel extends DefaultCategoryInterface, Document { }
