import { v4 as uuid } from 'uuid';
import { Schema, VirtualType } from 'mongoose';
import { BusinessSchemaName } from '@pe/business-kit';

export const AccessConfigSchemaName: string = 'AccessConfig';
export class AccessConfigSchemaFactory {
  private static schema: Schema;

  public static create(applicationSchema: string): Schema {
    if (!this.schema) {
      this.schema = new Schema(
        {
          _id: {
            default: uuid,
            type: String,
          },
          application: { type: String, ref: applicationSchema },

          isLive: {
            default: false,
            type: Boolean,
          },
          isLocked: {
            default: false,
            type: Boolean,
          },
          isPrivate: {
            default: false,
            type: Boolean,
          },

          business: {
            ref: BusinessSchemaName,
            type: String,
          },
          version: {
            type: String,
          },
        },
        {
          timestamps: true,
          toJSON: {
            transform: (doc: any, ret: any) => {
              delete ret.privatePassword;
            },
          },
          toObject: {
            transform: (doc: any, ret: any) => {
              delete ret.privatePassword;
            },
          },
        },
      );
      this.schema.index({ application: 1 });
      this.schema.virtual('id').get(function (): VirtualType {
        return this._id;
      });
    }

    return this.schema;
  }
}

