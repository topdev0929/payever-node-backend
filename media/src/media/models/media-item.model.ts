import { Document } from 'mongoose';
import { MediaItemInterface } from '../interfaces';

export interface MediaItemModel extends MediaItemInterface, Document { }
