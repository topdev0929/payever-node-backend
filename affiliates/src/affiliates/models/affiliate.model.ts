import { Document } from 'mongoose';
import { AffiliateInterface } from '../interfaces';

export interface AffiliateModel extends AffiliateInterface, Document { }
