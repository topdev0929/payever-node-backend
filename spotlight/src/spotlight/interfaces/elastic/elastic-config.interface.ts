import { ElasticConfigIndexInterface } from './elastic-config-index.interface';
import { ElasticMappingFieldsConfigInterface } from './elastic-mapping-fields-config.interface';

export interface ElasticConfigInterface {
  index: ElasticConfigIndexInterface;
  mappingFields: ElasticMappingFieldsConfigInterface;
  searchFields: string[];
  storeFields: string[];
}
