import { Document } from 'mongoose';
import { BusinessStepInterface } from '../interfaces';

export interface BusinessStepModel extends BusinessStepInterface, Document { }
