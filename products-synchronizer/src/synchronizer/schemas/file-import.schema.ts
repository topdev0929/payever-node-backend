import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

export const FileImportSchemaName: string = 'FileImport';

export const FileImportSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  fileUrl: { type: String, required: true },
  overwriteExisting: { type: Boolean, default: false },
  uploadedImages: [
    {
      originalName: String,
      url: String,
    },
  ],
});
