import { MarketplaceInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface MarketplaceModel extends MarketplaceInterface, Document { }
