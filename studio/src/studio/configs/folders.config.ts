import { FoldersPluginOptionsInterface } from '@pe/folders-plugin';
import { environment } from '../../environments';
import { UserMediaSchema, UserMediaSchemaName } from '../schemas';
import { FiltersConfig } from './filters.config';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../enums';

export const FoldersConfig: FoldersPluginOptionsInterface<any> = {
  combinedList: false,
  documentSchema: {
    schema: UserMediaSchema,
    schemaName: UserMediaSchemaName,
  },
  elastic: {
    env: {
      ...environment.elastic,
      elasticSearchHost: environment.elastic.elasticSearch,
    },
    index: {
      businessIdField: 'businessId',
      documentIdField: '_id',
      elasticIndex: `studio-folder`,
      type: `studio-folder`,
    },
    mappingFields: {
    _id: {
      fielddata: true,
      type: 'text',
    },
    album: {
      fielddata: true,
      type: 'text',
    },
    businessId: {
      fielddata: true,
      type: 'text',
    },
    example: {
      fielddata: true,
      type: 'boolean',
    },
    mediaType: {
      fielddata: true,
      type: 'text',
    },
    name: {
      fielddata: true,
      type: 'text',
    },
    updatedAt: {
      type: 'date',
    },
    url: {
      fielddata: true,
      type: 'text',
    },
    },
    searchFields: [
      '_id^1',
      'album^1',
      'businessId^1',
      'example^1',
      'mediaType^1',
      'name^1',
      'url^1',
      'updatedAt^1',
    ],
    storeFields: [
      '_id',
      'album',
      'businessId',
      'example',
      'mediaType',
      'name',
      'url',
      'updatedAt',
    ],
  },
  filters: FiltersConfig,
  microservice: 'studio',

  rabbitConfig: {
    documentConsumer: {
      exchange: RabbitExchangesEnum.studioFolders,
      rabbitChannel: RabbitChannelsEnum.StudioFolders,
    },
    exportConsumer: {
      exchange: RabbitExchangesEnum.studioExport,
      rabbitChannel: RabbitChannelsEnum.StudioExport,
    },
  },

  redisConfig: environment.redis,

  useBusiness: true,
};
