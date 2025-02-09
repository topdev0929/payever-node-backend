import { model, Model } from 'mongoose';
import { UuidDocument } from './interfaces/uuid-document';
import { originAppSchema } from './schemas/origin-app.schema';
import { OriginApp } from './interfaces/origin-app';

export interface OriginAppModel extends OriginApp, UuidDocument {
}

export const originAppModel: Model<OriginAppModel> = model<OriginAppModel>(
  'OriginApps',
  originAppSchema,
);
