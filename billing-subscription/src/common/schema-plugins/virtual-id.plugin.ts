import { Schema, Document, SchemaOptions } from 'mongoose';

type ToObject = SchemaOptions['toObject'];
type ToJSON = SchemaOptions['toJSON'];

export function VirtualId(schema: Schema): void {
  schema.virtual('id').get(function (this: Document): any {
    return this._id;
  });

  const toObject: ToObject = schema.get('toObject');
  schema.set('toObject', {
    ...toObject,
    virtuals: true,
  } as ToObject);

  const toJSON: ToJSON = schema.get('toJSON');
  schema.set('toJSON', {
    ...toJSON,
    virtuals: true,
  } as ToJSON);
}
