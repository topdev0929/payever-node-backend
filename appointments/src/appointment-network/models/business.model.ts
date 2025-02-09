import { BusinessInterface } from '../interfaces/business.interface';
import { Document } from 'mongoose';

export interface BusinessModel extends BusinessInterface, Document { }
