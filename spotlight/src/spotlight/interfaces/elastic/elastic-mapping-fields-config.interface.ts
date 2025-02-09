import { ElasticFieldConfigInterface } from './elastic-field-config.interface';

export interface ElasticMappingFieldsConfigInterface {
  [field: string]: ElasticFieldConfigInterface;
}
