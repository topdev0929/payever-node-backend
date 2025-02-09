import { Document } from 'mongoose';
import { StatisticsEventsInterface } from '../interfaces/statistics-events.interface';

export interface StatisticsEventsModel extends StatisticsEventsInterface, Document { }
