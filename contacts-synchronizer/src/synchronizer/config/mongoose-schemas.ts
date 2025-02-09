import { ModelDefinition } from '@nestjs/mongoose';

import {
  SynchronizationTaskSchema,
  SynchronizationTaskSchemaName,
  SynchronizationSchema,
  SynchronizationSchemaName,
  SynchronizationTaskItemSchema,
  SynchronizationTaskItemSchemaName,
  FileImportSchema,
  FileImportSchemaName,
} from '../schemas';

export const MongooseSchemas: ModelDefinition[] = [
  {
    name: SynchronizationSchemaName,
    schema: SynchronizationSchema,
  },
  {
    name: SynchronizationTaskSchemaName,
    schema: SynchronizationTaskSchema,
  },
  {
    name: FileImportSchemaName,
    schema: FileImportSchema,
  },
  {
    name: SynchronizationTaskItemSchemaName,
    schema: SynchronizationTaskItemSchema,
  },
];
