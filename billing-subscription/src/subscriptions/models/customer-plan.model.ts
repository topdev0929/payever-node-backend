import { Document } from 'mongoose';
import { CustomerPlanInterface } from '../interfaces/entities';


export interface CustomerPlanModel extends Document, CustomerPlanInterface {
    _id: string;
}
