import { Document } from 'mongoose';
import { BusinessActiveInterface } from '../interfaces';

export interface BusinessActiveModel extends BusinessActiveInterface, Document { }
