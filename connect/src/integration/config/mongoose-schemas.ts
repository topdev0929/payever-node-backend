import { BusinessSchema, BusinessSchemaName } from '../../business/schemas';
import {
  CategorySchema,
  CategorySchemaName,
  IntegrationSchema,
  IntegrationSchemaName,
  IntegrationSubscriptionSchema,
  IntegrationReviewSchema,
  IntegrationWrapperSubscriptionSchemaName,
  IntegrationWrapperSubscriptionSchema,
  IntegrationSubscriptionSchemaName,
  IntegrationReviewSchemaName,
  PendingInstallationSchemaName,
  PendingInstallationSchema,
} from '../schemas';

export const MongooseSchemas: any = [
  {
    name: BusinessSchemaName,
    schema: BusinessSchema,
  },
  {
    name: IntegrationSchemaName,
    schema: IntegrationSchema,
  },
  {
    name: IntegrationSubscriptionSchemaName,
    schema: IntegrationSubscriptionSchema,
  },
  {
    name: IntegrationReviewSchemaName,
    schema: IntegrationReviewSchema,
  },
  {
    name: CategorySchemaName,
    schema: CategorySchema,
  },
  {
    name: IntegrationWrapperSubscriptionSchemaName,
    schema: IntegrationWrapperSubscriptionSchema,
  },
  {
    name: PendingInstallationSchemaName,
    schema: PendingInstallationSchema,
  },
];
