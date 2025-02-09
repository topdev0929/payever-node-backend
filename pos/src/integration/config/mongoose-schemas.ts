import {
  BusinessIntegrationSubSchemaName,
  IntegrationSchemaName,
  PendingInstallationSchemaName,
  TerminalIntegrationSubSchemaName,
} from '../../mongoose-schema/mongoose-schema.names';
import { IntegrationSchema, IntegrationSubscriptionSchema } from '../schemas';
import { PendingInstallationSchema } from '../schemas/pending-installation.schema';

export const MongooseSchemas: any = [
  {
    name: IntegrationSchemaName,
    schema: IntegrationSchema,
  },
  {
    name: BusinessIntegrationSubSchemaName,
    schema: IntegrationSubscriptionSchema,
  },
  {
    name: TerminalIntegrationSubSchemaName,
    schema: IntegrationSubscriptionSchema,
  },
  {
    name: PendingInstallationSchemaName,
    schema: PendingInstallationSchema,
  },
];
