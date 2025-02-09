import { Document } from 'mongoose';
import { TrafficSourceInterface } from '../interfaces';
import { BusinessModel } from './business.model';

export interface TrafficSourceModel extends Document, TrafficSourceInterface {
    business?: BusinessModel;
}
