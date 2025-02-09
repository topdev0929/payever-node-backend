import { Document } from 'mongoose';
import { ErrorNotificationInterface } from '../interfaces';

export interface ErrorNotificationModel extends ErrorNotificationInterface, Document { }
