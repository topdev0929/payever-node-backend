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

export const MongooseSchemas: any = [
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
