import { Document } from 'mongoose';
import { AppInterface } from '../interfaces';

export interface AppModel extends AppInterface, Document { }
