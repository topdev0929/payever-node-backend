import { Document } from 'mongoose';
import { DeliveryAttemptInterface } from '../interfaces';

export interface DeliveryAttemptModel extends DeliveryAttemptInterface, Document { }
