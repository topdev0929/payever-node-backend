import { Document } from 'mongoose';
import { WidgetPropsInterface } from '../interfaces';

export interface WidgetPropsModel extends WidgetPropsInterface, Document {
}
