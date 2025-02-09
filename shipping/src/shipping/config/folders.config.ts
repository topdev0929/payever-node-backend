import { FoldersPluginOptionsInterface, AnalyzerEnum, SearchAnalyzer } from '@pe/folders-plugin';
import { ShippingBoxSchema, ShippingBoxSchemaName } from '../schemas';
import { environment } from '../../environments';
import { FiltersConfig } from './filters.config';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../../environments/rabbitmq';

export const FoldersConfig: FoldersPluginOptionsInterface<any> = {
  combinedList: false,
  documentSchema: {
    schema: ShippingBoxSchema,
    schemaName: ShippingBoxSchemaName,
  },
  elastic: {
    env: environment.elasticEnv,
    index: {
      businessIdField: 'businessId',
      documentIdField: '_id',
      elasticIndex: `shipping-box-folder`,
      type: `shipping-box-folder`,
    },
    mappingFields: {
      createdBy: {
        fielddata: true,
        type: 'date',
      },
      dimensionUnit: {
        fielddata: true,
        type: 'text',
      },
      height: {
        fielddata: true,
        type: 'number',
      },
      integration: {
        fielddata: true,
        type: 'text',
      },
      isDefault: {
        type: 'boolean',
      },
      kind: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      length: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      name: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      type: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      updatedAt: {
        type: 'date',
      },
      weight: {
        fielddata: true,
        type: 'number',
      },
      weightUnit: {
        fielddata: true,
        type: 'text',
      },
      width: {
        fielddata: true,
        type: 'number',
      },
    },
    searchFields: [
      'dimensionUnit^1',
      'createdBy^1',
      'height^1',
      'integration^1',
      'kind^1',
      'length^1',
      'name^1',
      'type^1',
      'weight^1',
      'weightUnit^1',
      'width^1',
    ],
    storeFields: [
      'dimensionUnit',
      'createdBy',
      'height',
      'integration',
      'isDefault',
      'kind',
      'length',
      'name',
      'type',
      'weight',
      'weightUnit',
      'width',
    ],
  },
  filters: FiltersConfig,
  microservice: 'shipping',
  rabbitConfig: {
    documentConsumer: {
      exchange: RabbitExchangesEnum.shippingFolders,
      rabbitChannel: RabbitChannelsEnum.ShippingFolders,
    },
    exportConsumer: {
      exchange: RabbitExchangesEnum.shippingFoldersExport,
      rabbitChannel: RabbitChannelsEnum.ShippingFoldersExport,
    },    
  },
  redisConfig: environment.redis,
  useBusiness: true,
};
