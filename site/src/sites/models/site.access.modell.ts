import { Document } from 'mongoose';
import { SiteAccessConfigDocument } from '../schemas';

export interface SiteAccessModel extends  SiteAccessConfigDocument, Document<string> {
}
