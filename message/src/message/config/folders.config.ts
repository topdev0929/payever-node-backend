import { FoldersPluginOptionsInterface, AnalyzerEnum, SearchAnalyzer } from '@pe/folders-plugin';
import { environment } from '../../environments';
import { AbstractMessaging, AbstractMessagingSchema, AbstractMessagingDocument } from '../submodules/platform';
import { FiltersConfig } from './filters-config';
import { messagingToFolderItem } from '../transformers';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../enums';

export const FoldersConfig: FoldersPluginOptionsInterface<AbstractMessagingDocument> = {
  combinedList: false,
  documentSchema: {
    map: messagingToFolderItem,
    schema: AbstractMessagingSchema,
    schemaName: AbstractMessaging.name,
  },
  elastic: {
    env: {
      elasticSearchAuthPassword: environment.elastic.password,
      elasticSearchAuthUsername: environment.elastic.username,
      elasticSearchCloudId: environment.elastic.cloudId,
      elasticSearchHost: environment.elastic.host,
    },

    index: {
      businessIdField: 'business',
      documentIdField: '_id',
      elasticIndex: 'folder_chats',
      type: 'folder_chat',
    },

    mappingFields: {
      contact: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      deleted: {
        type: 'boolean',
      },
      integrationName: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
      subType: {
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
      type: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
    },

    searchFields: [
      'contact^1',
      'deleted^1',
      'title^1',
    ],

    storeFields: [
      'contact',
      'deleted',
      'integrationName',
      'members',
      'subType',
      'title',
      'type',
    ],
  },
  filters: FiltersConfig,
  microservice: 'message',
  rabbitConfig: {
    documentConsumer: {
      exchange: RabbitExchangesEnum.messageFolders,
      rabbitChannel: RabbitChannelsEnum.MessageFolders,
    },
    exportConsumer: {
      exchange: RabbitExchangesEnum.messageFoldersExport,
      rabbitChannel: RabbitChannelsEnum.MessageFoldersExport,
    },    
  },
  redisConfig: environment.redis as any,
  useBusiness: true,
  useUserScope: true,
};
