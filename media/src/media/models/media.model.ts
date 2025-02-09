import { Document } from 'mongoose';
import { MediaInterface } from '../interfaces';

export interface MediaModel extends MediaInterface, Document { }
