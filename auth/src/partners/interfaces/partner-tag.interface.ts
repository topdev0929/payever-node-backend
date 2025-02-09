import { Document } from 'mongoose';
import { PartnerTagName } from '@pe/nest-kit';

export interface PartnerTagInterface extends Document {
  _id: string;
  partnerTags: PartnerTagName[];
  toObject: () => any;
}
