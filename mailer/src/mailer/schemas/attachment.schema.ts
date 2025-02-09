import { Schema } from 'mongoose';

export const AttachmentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    name: { type: String, required: true },
  },
);

AttachmentSchema.virtual('binaryContent')
  .get(function(): Buffer {
    return Buffer.from(this.content, 'base64');
  });
