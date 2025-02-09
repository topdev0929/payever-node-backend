import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const AppActionSchemaName: string = 'AppAction';
export const AppActionSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },

    description: {
      type: Schema.Types.String,
    },
    method: {
      required: true,
      type: Schema.Types.String,
    },
    name: {
      required: true,
      type: Schema.Types.String,
    },
    roles: {
      default: [],
      type: [String],
    },
    url: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: { },
  },
);

AppActionSchema.index({ name: 1 });
