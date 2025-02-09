import { Document } from 'mongoose';
import { FraudListInterface } from '../interfaces';

export interface FraudListModel extends FraudListInterface, Document { }
