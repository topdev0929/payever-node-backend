import { Document } from 'mongoose';
import { IntegrationInterface } from '../interfaces/integration.interface';
import { InstallationOptionsModel } from './installation-options.model';

export interface IntegrationModel extends IntegrationInterface, Document {
  avgRating?: number;
  readonly installationOptions: InstallationOptionsModel;
  ratingsCount?: number;
  timesInstalled: number;
}
