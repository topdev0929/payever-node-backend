import { Document } from 'mongoose';
import { WidgetInterface } from '../interfaces';

export interface WidgetModel extends WidgetInterface, Document { }
