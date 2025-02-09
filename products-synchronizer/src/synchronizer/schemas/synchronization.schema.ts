import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BusinessSchemaName } from '@pe/business-kit';
import {
  IntegrationSchemaName,
  SynchronizationSchemaName as KitSynchronizationSchemaName,
  SynchronizationSchema as KitSynchronizationSchema,
} from '@pe/synchronizer-kit';


export const SynchronizationSchemaName: string = KitSynchronizationSchemaName;

export const SynchronizationSchema: Schema = KitSynchronizationSchema;

