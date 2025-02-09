import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { ActionSchema } from './action.schema';
import { FormFieldSchema } from './form-field.schema';
import { OnboardingTypeEnum } from '../enums';

export const OnboardingSchemaName: string = 'Onboarding';
export const OnboardingSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.String, default: uuid },
    logo: {
      required: true,
      type: String,
    },
    name: {
      required: true,
      type: String,
      unique: true,
    },
    type: {
      enum: Object.values(OnboardingTypeEnum),
      required: true,
      type: String,
    },
    wallpaperUrl: {
      required: true,
      type: String,
    },

    accountFlags: {
      required: false,
      type: Schema.Types.Mixed,
    },
    afterLogin: {
      default: [],
      type: [ActionSchema],
    },
    afterRegistration: {
      default: [],
      type: [ActionSchema],
    },
    defaultLoginByEmail: {
      required: false,
      type: Boolean,
    },
    form: {
      default: [],
      type: [FormFieldSchema],
    },
    redirectUrl: {
      required: false,
      type: String,
    },

  },
  {
    timestamps: { },
  },
);
