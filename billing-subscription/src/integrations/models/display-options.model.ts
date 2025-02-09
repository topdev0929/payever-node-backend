import { Document } from 'mongoose';
import { DisplayOptionsInterface } from '../interfaces';

export interface DisplayOptionsModel extends DisplayOptionsInterface, Document { }
