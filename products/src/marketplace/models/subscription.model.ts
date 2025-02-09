import { SubscriptionInterface } from '../interfaces';
import { Document } from 'mongoose';

export interface SubscriptionModel extends SubscriptionInterface, Document { }
