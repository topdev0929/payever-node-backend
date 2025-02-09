import { Document } from 'mongoose';
import { MediaItemRelationInterface } from '../interfaces';

export interface MediaItemRelationModel extends MediaItemRelationInterface, Document { }
