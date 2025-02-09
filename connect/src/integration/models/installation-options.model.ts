import { Document, Types } from 'mongoose';
import { InstallationOptionsInterface } from '../interfaces';
import { LinkModel } from './link.model';

export interface InstallationOptionsModel extends InstallationOptionsInterface, Document {
  readonly links: Types.DocumentArray<LinkModel>;
}
