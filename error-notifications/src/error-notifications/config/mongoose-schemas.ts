import {
  ErrorNotificationSchema,
  ErrorNotificationSchemaName,
  SettingsSchema,
  SettingsSchemaName,
  TransactionSchema,
  TransactionSchemaName,
} from '../schemas';

export const MongooseSchemas: any = [
  {
    name: ErrorNotificationSchemaName,
    schema: ErrorNotificationSchema,
  },
  {
    name: SettingsSchemaName,
    schema: SettingsSchema,
  },
  {
    name: TransactionSchemaName,
    schema: TransactionSchema,
  },
];
