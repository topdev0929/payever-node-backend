import { AnalyzerEnum } from '../../enums';
import { ElasticMappingFieldsConfigInterface } from './elastic-mapping-fields-config.interface';

export interface ElasticFieldConfigInterface {
  type: string;
  fielddata?: boolean;
  fields?: any;
  properties?: ElasticMappingFieldsConfigInterface;
  analyzer?: AnalyzerEnum;
  search_analyzer?: AnalyzerEnum;
}
