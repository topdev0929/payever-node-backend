import { ShopInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface ShopModel extends  ShopInterface, Document { }
