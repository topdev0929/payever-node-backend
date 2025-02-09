import { CubeInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface CubeModel extends Document, CubeInterface { }
