/* eslint-disable @typescript-eslint/unbound-method */
import { FoldersPluginOptionsInterface, AnalyzerEnum, SearchAnalyzer } from '@pe/folders-plugin';
import { FiltersConfig } from './filters.config';
import { DashboardModel } from '../models';
import { DashboardSchema, DashboardSchemaName } from '../schemas';
import { MappingHelper } from '../helpers/mapping.helper';
import { environment } from '../../environments';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../../environments/rabbitmq';

export const FoldersConfig: FoldersPluginOptionsInterface<DashboardModel> = {
  combinedList: false,
  documentSchema: {
    map: MappingHelper.map,
    schema: DashboardSchema,
    schemaName: DashboardSchemaName,
  },
  elastic: {
    env: {
      elasticSearchAuthPassword: environment.elastic.password,
      elasticSearchAuthUsername: environment.elastic.username,
      elasticSearchCloudId: environment.elastic.cloudId,
      elasticSearchHost: environment.elastic.host,
    },
    index: {
      businessIdField: 'businessId',
      documentIdField: '_id',
      elasticIndex: `dashboard-folder`,
      type: `dashboard-folder`,
    },
    mappingFields: {
      createdBy: {
        fielddata: true,
        type: 'text',
      },
      name: {
        analyzer: AnalyzerEnum.Autocomplete,
        fielddata: true,
        search_analyzer: SearchAnalyzer.AutocompleteSearch,
        type: 'text',
      },
    },
    searchFields: [
      'createdBy^1',
      'name^1',
    ],
    storeFields: [
      'createdBy',
      'name',
    ],
  },
  filters: FiltersConfig,
  microservice: environment.microservice,

  rabbitConfig: {
    documentConsumer: {
      exchange: RabbitExchangesEnum.statisticsFolders,
      rabbitChannel: RabbitChannelsEnum.StatisticsFolders,
    },
    exportConsumer: {
      exchange: RabbitExchangesEnum.statisticsFoldersExport,
      rabbitChannel: RabbitChannelsEnum.StatisticsFoldersExport,
    },    
  },
  redisConfig: environment.redis,

  useBusiness: true,
};
