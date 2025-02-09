import { BusinessMediaInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface BusinessMediaModel extends  BusinessMediaInterface, Document { }
