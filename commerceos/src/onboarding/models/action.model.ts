import { Document } from 'mongoose';
import { ActionInterface } from '../interfaces';

export interface ActionModel extends ActionInterface, Document {

}
