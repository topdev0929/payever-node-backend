import { model, Model } from 'mongoose';

import { businessSchema } from './schemas/business.schema';
import { Business } from './interfaces/business';
import { UuidDocument } from './interfaces/uuid-document';

export interface BusinessModel extends Business, UuidDocument { }

export const businessModel: Model<BusinessModel> = model<BusinessModel>('Business', businessSchema);
