import { Document } from 'mongoose';
import { FlowInterface } from '../interfaces';

export interface FlowModel extends FlowInterface, Document { }
