import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { FormFieldValueSchema } from './form-field-value.schema';
import { FormFieldTypeEnum } from '../enums';
import { ActionSchema } from './action.schema';

export const FormFieldSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.String, default: uuid },
    getValues: {
      type: ActionSchema,
    },
    icon: {
      required: false,
      type: String,
    },
    name: {
      required: true,
      type: String,
    },
    placeholder: {
      required: true,
      type: String,
    },
    relativeField: {
      type: String,
    },
    required: {
      default: false,
      required: true,
      type: Boolean,
    },
    submitAction: {
      type: ActionSchema,
    },
    title: {
      required: true,
      type: String,
    },
    type: {
      enum: Object.values(FormFieldTypeEnum),
      required: true,
      type: String,
    },
    values: {
      default: [],
      type: [FormFieldValueSchema],
    },
  },
);
