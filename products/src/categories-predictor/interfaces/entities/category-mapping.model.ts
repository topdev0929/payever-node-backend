import { Document } from 'mongoose';
import { CategoryMappingInterface } from './category-mapping.interface';

export interface CategoryMappingModel extends CategoryMappingInterface, Document { }
