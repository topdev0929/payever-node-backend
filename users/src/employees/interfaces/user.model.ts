import { Document } from 'mongoose';
import { UserInterface } from './user.interface';

export const UserModelName: string = 'UserModel';

export interface UserModel extends Document, UserInterface { }
