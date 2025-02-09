import { FoldersPluginOptionsInterface, AnalyzerEnum, SearchAnalyzer } from '@pe/folders-plugin';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../../common';
import { environment } from '../../environments';
import { MappingHelper } from '../helpers';
import { PostSchema, PostSchemaName } from '../schemas';
import { FiltersConfig } from './filters-config';

export const FoldersConfig: FoldersPluginOptionsInterface<any> = {
  combinedList: false,
  documentSchema: {
    map: (data: any) => MappingHelper.map(data),
    schema: PostSchema,
    schemaName: PostSchemaName,
  },
  elastic: {
    env: environment.elasticEnv,
    index: {
      businessIdField: 'businessId',
      documentIdField: '_id',
      elasticIndex: `post-folder`,
      type: `post-folder`,
    },
    mappingFields: {
      content: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      media: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      postedAt: {
        type: 'date',
      },
      sentStatus: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      status: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      title: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      toBePostedAt: {
        type: 'date',
      },
      sortDate: {
        type: 'date',
      },
      createdAt: {
        type: 'date',
      },
      updatedAt: {
        type: 'date',
      },
      type: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
    },
    searchFields: [
      'content^1',
      'media^1',
      'postedAt^1',
      'sentStatus^1',
      'status^1',
      'title^1',
      'toBePostedAt^1',
      'type^1',
    ],
    storeFields: [
      'content',
      'media',
      'postedAt',
      'sentStatus',
      'status',
      'title',
      'toBePostedAt',
      'type',
      'sortDate',
      'createdAt',
      'updatedAt',
    ],
  },
  filters: FiltersConfig,
  microservice: 'social',

  rabbitConfig: {
    documentConsumer: {
      exchange: RabbitExchangesEnum.socialFolders,
      rabbitChannel: RabbitChannelsEnum.SocialFolders,
    },
    exportConsumer: {
      exchange: RabbitExchangesEnum.socialFoldersExport,
      rabbitChannel: RabbitChannelsEnum.SocialFoldersExport,
    },
  },

  redisConfig: environment.redis,

  useBusiness: true,
};
