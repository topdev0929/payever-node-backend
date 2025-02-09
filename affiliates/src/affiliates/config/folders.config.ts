import { FoldersPluginOptionsInterface } from '@pe/folders-plugin';
import { AffiliateProgramSchema, AffiliateProgramSchemaName } from '../schemas';
import { environment } from '../../environments';
import { FiltersConfig } from './filters.config';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../enums';

export const FoldersConfig: FoldersPluginOptionsInterface<any> = {
  applicationScope: {
    documentFilterField: 'affiliateBranding',
    useApplicationScope: true,
  },
  combinedList: false,
  documentSchema: {
    schema: AffiliateProgramSchema,
    schemaName: AffiliateProgramSchemaName,
  },
  elastic: {
    env: environment.elastic,
    index: {
      businessIdField: 'businessId',
      documentIdField: '_id',
      elasticIndex: `affiliate-program-folder`,
      type: `affiliate-program-folder`,
    },
    mappingFields: {
      affiliateBranding: {
        fielddata: true,
        type: 'text',
      },
      assets: {
        type: 'integer',
      },
      clicks: {
        type: 'integer',
      },
      commissionType: {
        fielddata: true,
        type: 'text',
      },
      cookie: {
        type: 'date',
      },
      currency: {
        fielddata: true,
        type: 'text',
      },
      name: {
        fielddata: true,
        type: 'text',
      },
      programApi: {
        fielddata: true,
        type: 'text',
      },
      startedAt: {
        type: 'date',
      },
      status: {
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
      'businessId^1',
      'assets^1',
      'affiliateBranding^1',
      'clicks^1',
      'commissionType^1',
      'cookie^1',
      'currency^1',
      'name^1',
      'programApi^1',
      'startedAt^1',
      'status^1',
      'url^1',
      'updatedAt^1',
    ],
    storeFields: [
      '_id',
      'businessId',
      'affiliates',
      'assets',
      'affiliateBranding',
      'channelSets',
      'clicks',
      'commission',
      'commissionType',
      'cookie',
      'currency',
      'name',
      'products',
      'programApi',
      'startedAt',
      'status',
      'url',
      'updatedAt',
    ],
  },
  filters: FiltersConfig,
  microservice: environment.microservice,

  rabbitConfig: {
    documentConsumer: {
      exchange: RabbitExchangesEnum.affiliatesFolders,
      rabbitChannel: RabbitChannelsEnum.AffiliatesFolders,
    },
    exportConsumer: {
      exchange: RabbitExchangesEnum.affiliatesFoldersExport,
      rabbitChannel: RabbitChannelsEnum.AffiliatesFoldersExport,
    },    
  },
  redisConfig: environment.redis,
  useBusiness: true,
};
