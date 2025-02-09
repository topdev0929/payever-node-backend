import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { FraudListSchemaName } from './fraud-list.schema';

export const RuleConditionSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    compareTo: {
      required: false,
      type: String,
    },
    customField: {
      required: false,
      type: String,
    },
    expiryDate: {
      ref: FraudListSchemaName,
      type: String,
    },
    field: {
      required: false,
      type: String,
    },
    geoLocation: {
      required: false,
      type: String,
    },
    listId: {
      required: false,
      type: String,
    },
    operator: {
      required: false,
      type: String,
    },
    threshold: {
      required: false,
      type: String,
    },
    timeUnit: {
      required: false,
      type: String,
    },
    type: {
      required: true,
      type: String,
    },
    value: {
      required: false,
      type: Schema.Types.Mixed,
    },
  },
);
