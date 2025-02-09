import { Document } from 'mongoose';
import { OrderCartItemInterface } from '../interfaces';

export interface OrderCartItemModel extends OrderCartItemInterface, Document { }
