import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const MobileAppSchemaName: string = 'mobile_settings';

export const MobileAppSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    appleStoreUrl: String,
    currentVersion: String,
    minVersion: String,
    playStoreUrl: String,
  },
  {
    collection: MobileAppSchemaName,
    toJSON: {
      transform: (doc: any, ret: any) => {
        delete ret._id;
        delete ret.__v;

        return ret;
      },
    },
  },
);
