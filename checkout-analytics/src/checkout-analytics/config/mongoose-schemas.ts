import {
  ActionApiCallSchema,
  ActionApiCallSchemaName,
  ApiCallSchema,
  ApiCallSchemaName,
  CheckoutFormMetricsSchema,
  CheckoutFormMetricsSchemaName,
  CheckoutMetricsSchema,
  CheckoutMetricsSchemaName,
  OAuthTokenSchema,
  OAuthTokenSchemaName,
  PaymentSchema,
  PaymentSchemaName,
  ReportSchema,
  ReportSchemaName,
} from '../schemas';

export const MongooseSchemas: any = [
  {
    name: ActionApiCallSchemaName,
    schema: ActionApiCallSchema,
  },
  {
    name: ApiCallSchemaName,
    schema: ApiCallSchema,
  },
  {
    name: CheckoutFormMetricsSchemaName,
    schema: CheckoutFormMetricsSchema,
  },
  {
    name: CheckoutMetricsSchemaName,
    schema: CheckoutMetricsSchema,
  },
  {
    name: OAuthTokenSchemaName,
    schema: OAuthTokenSchema,
  },
  {
    name: PaymentSchemaName,
    schema: PaymentSchema,
  },
  {
    name: ReportSchemaName,
    schema: ReportSchema,
  },
];
