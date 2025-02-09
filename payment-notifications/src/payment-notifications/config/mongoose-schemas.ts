import {
  ApiCallSchemaName,
  ApiCallSchema,
  NotificationSchemaName,
  NotificationSchema,
  DeliveryAttemptSchemaName,
  DeliveryAttemptSchema,
  ClientSchemaName,
  ClientSchema,
} from '../schemas';

export const MongooseSchemas: any = [
  {
    name: ApiCallSchemaName,
    schema: ApiCallSchema,
  },
  {
    name: DeliveryAttemptSchemaName,
    schema: DeliveryAttemptSchema,
  },
  {
    name: NotificationSchemaName,
    schema: NotificationSchema,
  },
  {
    name: ClientSchemaName,
    schema: ClientSchema,
  },
];
