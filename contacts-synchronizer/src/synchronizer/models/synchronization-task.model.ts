import { Document } from 'mongoose';
import { BusinessModel } from '@pe/business-kit';
import { IntegrationModel, FileImportModel } from '@pe/synchronizer-kit';
import { SynchronizationTaskInterface } from '../interfaces';

export interface SynchronizationTaskModel extends SynchronizationTaskInterface, Document {
  business?: BusinessModel;
  integration?: IntegrationModel;
  fileImport?: FileImportModel;
}
