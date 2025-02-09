import { Document } from 'mongoose';
import { PartnerTagName, UserRolePartner } from '@pe/nest-kit';

export interface PartnerRole extends UserRolePartner, Document {
  addPartnerTag: (tagName: PartnerTagName) => void;
  removePartnerTag: (tagName: PartnerTagName) => void;
  hasPartnerTag: (tagName: PartnerTagName) => boolean;
}
