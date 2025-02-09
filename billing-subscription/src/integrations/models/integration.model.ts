import { Document } from 'mongoose';
import { IntegrationInterface } from '../interfaces';
import { DisplayOptionsModel } from './display-options.model';

export interface IntegrationModel extends IntegrationInterface, Document {
  readonly displayOptions: DisplayOptionsModel;
}
