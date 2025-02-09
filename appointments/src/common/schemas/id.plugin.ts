import { v4 as uuid } from 'uuid';
import { Schema, Document } from 'mongoose';

export function idPlugin<T extends Document<string>>(schema: Schema<T>): void {
  schema.add({
    _id: {
      default: uuid,
      type: String,
    },
  });

  schema.virtual('id').get(function (this: T): string {
    return this._id;
  });
}
