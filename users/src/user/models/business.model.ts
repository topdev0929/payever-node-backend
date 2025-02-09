import { Document } from 'mongoose';
import { BusinessInterface, UserInterface } from '../interfaces';

export const BusinessModelName: string = 'BusinessModel';

export interface BusinessModel extends BusinessInterface, Document {
  businessDetail: any;
  owner: UserInterface | string;
}
