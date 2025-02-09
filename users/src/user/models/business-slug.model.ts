import { Document } from 'mongoose';
import { BusinessSlugInterface } from '../interfaces';

export interface BusinessSlugModel extends BusinessSlugInterface, Document { }
