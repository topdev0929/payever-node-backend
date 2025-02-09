import { Document } from 'mongoose';
import { UserWallpapersInterface } from '../interfaces';

export const UserWallpapersModelName: string = 'UserWallpapersModel';

export interface UserWallpapersModel extends UserWallpapersInterface, Document { }
