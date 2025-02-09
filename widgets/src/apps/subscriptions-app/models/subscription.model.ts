import { Document } from 'mongoose';
import { SubscriptionInterface } from '../interfaces';

export interface SubscriptionModel extends SubscriptionInterface, Document { }
