import { CouponInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface CouponModel extends  CouponInterface, Document { }
