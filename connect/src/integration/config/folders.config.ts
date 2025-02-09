import { FoldersPluginOptionsInterface } from '@pe/folders-plugin';
import { environment, RabbitChannelEnum, RabbitExchangesEnum } from '../../environments';
import { IntegrationSubscriptionSchema, IntegrationSubscriptionSchemaName } from '../schemas';
import { FiltersConfig } from './filters-config';
import { folderMapDocumentFnPopulate, folderMapPopulatedSubscriptionFn } from '../transformers';

export const FoldersConfig: FoldersPluginOptionsInterface<any> = {
  combinedList: false,
  documentSchema: {
    map: folderMapPopulatedSubscriptionFn,
    populate: folderMapDocumentFnPopulate,
    schema: IntegrationSubscriptionSchema,
    schemaName: IntegrationSubscriptionSchemaName,
  },
  elastic: {
    env: environment.elasticEnv,
    index: {
      businessIdField: 'businessId',
      documentIdField: '_id',
      elasticIndex: `connect-folder`,
      type: `connect-folder`,
    },
    mappingFields: {
      category: {
        type: 'text',
      },
      createdAt: {
        type: 'date',
      },
      developer: {
        fielddata: true,
        type: 'text',
      },
      developerTranslations: {
        type: 'object',
      },
      installed: {
        type: 'boolean',
      },
      integration: {
        type: 'keyword',
      },
      name: {
        fielddata: true,
        type: 'text',
      },
      titleTranslations: {
        type: 'object',
      },
    },
    searchFields: [
      'category^1',
      'titleTranslations^1',
      'developerTranslations^1',
    ],
    storeFields: [
    ],
  },
  filterRootFolders: true,
  filters: FiltersConfig,
  microservice: 'connect',
  rabbitConfig: {
    documentConsumer: {
      exchange:  RabbitExchangesEnum.connectFolders,
      rabbitChannel: RabbitChannelEnum.connectFolders,
    },
    exportConsumer: {
      exchange: RabbitExchangesEnum.connectFoldersExport,
      rabbitChannel: RabbitChannelEnum.connectFoldersExport,
    },
  },
  redisConfig: environment.redis,
  showAllChildDocumentsInRoot: true,
  useBusiness: true,
  useDefaultBusinessFolder: true,
};
