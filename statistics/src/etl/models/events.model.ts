import { Document } from 'mongoose';
import { EventsInterface } from '../interfaces';

export interface EventsModel extends EventsInterface, Document { }
