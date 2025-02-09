import { Document } from 'mongoose';
import { SubscriptionGroupInterface } from '../interfaces/subscription-group.interface';

export interface SubscriptionGroupModel extends SubscriptionGroupInterface, Document { }
