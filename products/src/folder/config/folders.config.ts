import { FoldersPluginOptionsInterface, SearchAnalyzer } from '@pe/folders-plugin';
import { AnalyzerEnum } from '@pe/elastic-kit';
import { environment } from '../../environments';
import { ProductSchema } from '../../products/schemas';
import { MappingHelper } from '../helpers/mapping.helper';
import { FiltersConfig } from './filters.config';
import { ProductModel } from '../../products/models';
import { MessageBusChannelsEnum, RabbitExchangesEnum } from '../../shared';

export const FoldersConfig: FoldersPluginOptionsInterface<ProductModel> = {
  combinedList: true,
  documentSchema: {
    map: (data) => MappingHelper.map(data),
    schema: ProductSchema,
    schemaName: 'products',
  },
  elastic: {
    env: {
      elasticSearchAuthPassword: environment.elasticSearchAuthPassword,
      elasticSearchAuthUsername: environment.elasticSearchAuthUsername,
      elasticSearchCloudId: environment.elasticSearchCloudId,
      elasticSearchHost: environment.elasticSearchHost,
    },
    index: {
      businessIdField: 'businessId',
      documentIdField: '_id',
      elasticIndex: `products-folder`,
      type: `products-folder`,
    },
    mappingFields: {
      active: {
        type: 'boolean',
      },
      album: {
        fielddata: true,
        type: 'text',
      },
      apps: {
        fielddata: true,
        type: 'text',
      },
      barcode: {
        fielddata: true,
        type: 'text',
      },
      category: {
        fielddata: true,
        type: 'text',
      },
      company: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      country: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      createdAt:  {
        type: 'date',
      },
      currency: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      describe: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      imagesUrl: {
        fielddata: true,
        type: 'text',
      },
      name:  {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      price: {
        type: 'double',
      },
      sku: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      title: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        fields: {
          raw: {
            analyzer : AnalyzerEnum.LowerCaseKeyword,
            fielddata: true,
            type : 'text',
          },
        },
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
      vatRate: {
        type: 'double',
      },
      videosUrl: {
        fielddata: true,
        type: 'text',
      },
    },
    searchFields: [
      'apps^1',
      'active^1',
      'album^1',
      'barcode^1',
      'category^1',
      'company^1',
      'country^1',
      'currency^1',
      'describe^1',
      'imagesUrl^1',
      'price^1',
      'sku^1',
      'title^1',
      'name^1',
      'type^1',
      'vatRate^1',
      'video^1',
      'updatedAt',
    ],
    storeFields: [
      '_id',
      'apps',
      'active',
      'album',
      'barcode',
      'category',
      'company',
      'country',
      'createdAt',
      'currency',
      'describe',
      'imagesUrl',
      'price',
      'sku',
      'title',
      'name',
      'type',
      'vatRate',
      'videosUrl',
      'updatedAt',
    ],
  },
  filters: FiltersConfig,
  microservice: 'products',
  useBusiness: true,

  rpc: {
    enabled: true,
    eventNamePrefix: 'products',
    queueName: MessageBusChannelsEnum.productsRpc,
  },

  rabbitConfig: {
    documentConsumer: {
      exchange: RabbitExchangesEnum.productsFolders,
      rabbitChannel: MessageBusChannelsEnum.productsFolders,
    },
    exportConsumer: {
      exchange: RabbitExchangesEnum.productsFolders,
      rabbitChannel: MessageBusChannelsEnum.productsFolders,
    },
  },

  redisConfig: environment.redis,
};
