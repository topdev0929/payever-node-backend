import { CollectionInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface CollectionModel extends CollectionInterface, Document { }
