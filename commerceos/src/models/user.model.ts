import { model, Model } from 'mongoose';
import { UuidDocument } from './interfaces/uuid-document';
import { userSchema } from './schemas/user.schema';
import { User } from './interfaces/user';

export interface UserModel extends User, UuidDocument { }

export const userModel: Model<UserModel> = model<UserModel>('User', userSchema);
