import { Document } from 'mongoose';
import { IntegrationVersionInterface } from '../interfaces/integration-version.interface';

export interface IntegrationVersionModel extends IntegrationVersionInterface, Document { }
