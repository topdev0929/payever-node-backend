
export interface DatasetSchemaInterface {
  fields: { [k: string]: DatasetSchemaFieldInterface };
  unique_by?: string[];
}

export interface DatasetSchemaFieldInterface {
  type: DatasetSchemaFieldTypeEnum;
  name: string;
  currency_code?: string;
  optional?: boolean;
}

export enum DatasetSchemaFieldTypeEnum {
  String = 'string',
  Number = 'number',
  Percentage = 'percentage',
  Date = 'date',
  Datetime = 'datetime',
  Money = 'money',
}
