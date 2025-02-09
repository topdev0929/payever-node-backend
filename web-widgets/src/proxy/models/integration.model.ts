import { Document, Types } from 'mongoose';
import { IntegrationInterface } from '../interfaces/';
import { InnerActionModel } from './';

export interface IntegrationModel extends IntegrationInterface, Document {
  actions: Types.DocumentArray<InnerActionModel>;
}
