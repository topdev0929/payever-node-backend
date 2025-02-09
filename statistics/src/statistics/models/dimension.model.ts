import { Document } from 'mongoose';
import { DimensionInterface } from '../interfaces';

export interface DimensionModel extends DimensionInterface, Document { }
