import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const SectionRuleSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  operator: String, // 'is' | 'isNot' | 'isNotEmpty'
  property: String, // specific for 'flow_property' type
  type: String, // 'flow_property'
  value: Number, // the value for checking in condition
});
