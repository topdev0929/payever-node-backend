import { Document } from 'mongoose';
import { BusinessWallpapersInterface } from '../interfaces';

export const BusinessWallpapersModelName: string = 'BusinessWallpapersModel';

export interface BusinessWallpapersModel extends BusinessWallpapersInterface, Document { }
