// tslint:disable: object-literal-sort-keys
import { FoldersPluginOptionsInterface } from '@pe/folders-plugin';
import { FiltersConfig } from './filters-config';
import { AppointmentSchema, AppointmentSchemaName } from '../schemas';
import { appointmentToESDocumentPopulateArgument, mapPopulatedAppointmentToFolderItemPrototype } from '../transformers';
import { environment } from '../../environments';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../enums';

export const FoldersConfig: FoldersPluginOptionsInterface<any> = {
  applicationScope: {
    documentFilterField: 'appointmentNetwork',
    useApplicationScope: true,
  },
  combinedList: false,
  documentSchema: {
    schema: AppointmentSchema,
    schemaName: AppointmentSchemaName,
    populate: appointmentToESDocumentPopulateArgument,
    map: mapPopulatedAppointmentToFolderItemPrototype,
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
      elasticIndex: `appointments-folder`,
      type: `appointments-folder`,
    },
    mappingFields: {
      appointmentNetwork: {
        fielddata: true,
        type: 'text',
      },
      fields: {
        fielddata: true,
        type: 'text',
      },
      parentFolder: {
        fielddata: true,
        type: 'text',
      },
      allDay: {
        type: 'boolean',
      },
      repeat: {
        type: 'boolean',
      },
      date: {
        fielddata: true,
        type: 'text',
      },
      time: {
        fielddata: true,
        type: 'text',
      },
      location: {
        type: 'text',
      },
      note: {
        fielddata: true,
        type: 'text',
      },
      products: {
        fielddata: true,
        type: 'text',
      },
      name: {
        fielddata: true,
        type: 'text',
      },
    },
    searchFields: [
      '_id^1',
      'appointmentNetwork^1',
      'fields^1',
      'allDay^1',
      'repeat^1',
      'date^1',
      'time^1',
      'location^1',
      'note^1',
      'products^1',
    ],
    storeFields: [
    ],
  },
  filters: FiltersConfig,
  microservice: 'appointments',
  useBusiness: true,
  rabbitConfig: {
    documentConsumer: {
      exchange: RabbitExchangesEnum.appointmentsFolders,
      rabbitChannel: RabbitChannelsEnum.AppointmentsFolders,
    },
    exportConsumer: {
      exchange: RabbitExchangesEnum.appointmentsFoldersExport,
      rabbitChannel: RabbitChannelsEnum.AppointmentsFoldersExport,
    },    
  },
  redisConfig: environment.redis,
};
