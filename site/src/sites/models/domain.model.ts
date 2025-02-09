import { Document } from 'mongoose';
import { DomainInterface } from '../interfaces';

export interface DomainModel extends DomainInterface, Document {

}
