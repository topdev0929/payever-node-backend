import { Document } from 'mongoose';
import { ActionApiCallInterface } from '../interfaces';

export interface ActionApiCallModel extends ActionApiCallInterface, Document { }
