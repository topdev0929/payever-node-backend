import { Document } from 'mongoose';
import { ProductBaseInterface } from '../interfaces/product-base.interface';

export interface ProductBaseModel extends ProductBaseInterface, Omit<Document, '_id'> { }
