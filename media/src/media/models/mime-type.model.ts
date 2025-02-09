import { Document } from 'mongoose';
import { MimeTypeInterface } from '../interfaces';

export interface MimeTypeModel extends MimeTypeInterface, Document { }
