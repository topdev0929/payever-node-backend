import { Document } from 'mongoose';
import { PushNotificationInterface } from '../interfaces';

export interface PushNotificationModel extends PushNotificationInterface, Document { }
