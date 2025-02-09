import { SiteInterface } from './site.interface';
import { Document } from 'mongoose';

export interface SiteModel extends SiteInterface, Document {
}
