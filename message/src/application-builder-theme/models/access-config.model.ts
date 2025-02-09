import { Document } from 'mongoose';
import { AccessConfigInterface } from '../interfaces';

export interface AccessConfigModel extends AccessConfigInterface, Document { }
