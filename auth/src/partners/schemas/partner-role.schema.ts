import { Schema } from 'mongoose';
import { PartnerTagName } from '@pe/nest-kit';
import { PartnerRole } from '../interfaces';

export const PartnerRoleSchema: Schema = new Schema(
  {
    partnerTags: [{
      enum: Object.values(PartnerTagName),
      type: String,
    }],
  },
  { _id: false },
);

PartnerRoleSchema.method('hasPartnerTag', function (
  this: PartnerRole,
  tagName: PartnerTagName,
): boolean {
  return this.partnerTags.includes(tagName);
});

PartnerRoleSchema.method('addPartnerTag', function (
  this: PartnerRole,
  tagName: PartnerTagName,
): void {
  if (!this.hasPartnerTag(tagName)) {
    this.partnerTags.push(tagName);
  }
});

PartnerRoleSchema.method('removePartnerTag', function (
  this: PartnerRole,
  tagName: PartnerTagName,
): void {
  const index: number = this.partnerTags.indexOf(tagName);
  if (index) {
    this.partnerTags.splice(index, 1);
  }
});
