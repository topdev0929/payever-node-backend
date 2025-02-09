import { Document } from 'mongoose';
import { InnerActionInterface } from '../interfaces';

export interface InnerActionModel extends InnerActionInterface, Document { }
