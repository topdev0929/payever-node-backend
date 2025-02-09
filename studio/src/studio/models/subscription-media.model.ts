import { Document } from 'mongoose';
import { SubscriptionMediaInterface } from '../interfaces';

export interface SubscriptionMediaModel extends SubscriptionMediaInterface,  Document {
}
