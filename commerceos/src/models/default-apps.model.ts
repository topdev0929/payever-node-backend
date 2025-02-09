import { defaultAppsSchema } from './schemas/default-apps.schema';
import { model, Model } from 'mongoose';
import { DefaultApps } from './interfaces/default-apps';
import { UuidDocument } from './interfaces/uuid-document';

export interface DefaultAppsModel extends DefaultApps, UuidDocument { }

export const defaultAppsModel: Model<DefaultAppsModel> = model<DefaultAppsModel>('DefaultApps', defaultAppsSchema);
