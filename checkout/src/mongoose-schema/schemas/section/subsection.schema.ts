import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { SectionRuleSchema } from './section-rule.schema';

export const SubsectionSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  code: String,
  rules: [SectionRuleSchema],
});
