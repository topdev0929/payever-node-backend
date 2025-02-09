import { DatasetSchemaFieldTypeEnum, DatasetSchemaInterface } from './interfaces';
import { DatasetNameEnum } from './enum';

export const DatasetSchemas: { [k: string]: DatasetSchemaInterface } = {
  [DatasetNameEnum.BusinessAppTrials]: {
    fields: {
      app: {
        name: 'App',
        optional: false,
        type: DatasetSchemaFieldTypeEnum.String,
      },
      country: {
        name: 'Country',
        optional: false,
        type: DatasetSchemaFieldTypeEnum.String,
      },
      date: {
        name: 'Date',
        optional: false,
        type: DatasetSchemaFieldTypeEnum.Date,
      },
    },
    // unique_by: ['date', 'country', 'app'],
  },
  [DatasetNameEnum.BusinessAppPaid]: {
    fields: {
      app: {
        name: 'App',
        optional: false,
        type: DatasetSchemaFieldTypeEnum.String,
      },
      country: {
        name: 'Country',
        optional: false,
        type: DatasetSchemaFieldTypeEnum.String,
      },
      date: {
        name: 'Date',
        optional: false,
        type: DatasetSchemaFieldTypeEnum.Date,
      },
    },
    // unique_by: ['date', 'country', 'app'],
  },
  [DatasetNameEnum.TransactionsByCountry]: {
    fields: {
      amount: {
        currency_code: 'EUR',
        name: 'Amount',
        optional: false,
        type: DatasetSchemaFieldTypeEnum.Money,
      },
      country: {
        name: 'Country',
        optional: false,
        type: DatasetSchemaFieldTypeEnum.String,
      },
      date: {
        name: 'Date',
        optional: false,
        type: DatasetSchemaFieldTypeEnum.Datetime,
      },
    },
    // unique_by: ['date', 'country'],
  },
};
