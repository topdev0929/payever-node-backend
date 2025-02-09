import { Document } from 'mongoose';
import { DomainInterface } from '../interfaces';
import { BlogModel } from './blog.model';

export interface DomainModel extends DomainInterface, Document {
    _id?: string;
    blog: BlogModel;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}
