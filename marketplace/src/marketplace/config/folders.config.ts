import { FoldersPluginOptionsInterface, AnalyzerEnum, SearchAnalyzer } from '@pe/folders-plugin';
import { environment } from '../../environments';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../enums';
import { ProductSchema, ProductSchemaName } from '../schemas';
import { FiltersConfig } from './filters-config';

export const FoldersConfig: FoldersPluginOptionsInterface<any> = {
  combinedList: false,
  documentSchema: {
    schema: ProductSchema,
    schemaName: ProductSchemaName,
  },
  elastic: {
    env: environment.elastic,
    index: {
      businessIdField: 'businessId',
      documentIdField: '_id',
      elasticIndex: `marketplace-folder`,
      type: `marketplace-folder`,
    },
    mappingFields: {
      channelSet: {
        fielddata: true,
        type: 'text',
      },
      country: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      currency: {
        fielddata: true,
        type: 'text',
      },
      imports: {
        fielddata: true,
        type: 'number',
      },
      price: {
        fielddata: true,
        type: 'number',
      },
      title: {
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
    },
    searchFields: [
      'channelSet^1',
      'country^1',
      'currency^1',
      'imports^1',
      'price^1',
      'title^1',
      'type^1',
      'updatedAt^1',
    ],
    storeFields: [
      'channelSet',
      'country',
      'currency',
      'imports',
      'rating',
      'price',
      'title',
      'type',
      'updatedAt',
    ],
  },
  filters: FiltersConfig,
  microservice: 'marketplace',

  rabbitConfig: {
    exportConsumer: {
      exchange: RabbitExchangesEnum.marketplaceFolders,
      rabbitChannel: RabbitChannelsEnum.MarketplaceFolders,
    },
    documentConsumer: {
      exchange: RabbitExchangesEnum.marketplaceFolders,
      rabbitChannel: RabbitChannelsEnum.MarketplaceFolders,
    },
  },
  redisConfig: environment.redis,

  useBusiness: true,
};
