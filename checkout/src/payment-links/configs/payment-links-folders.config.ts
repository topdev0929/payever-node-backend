import { FoldersPluginOptionsInterface } from '@pe/folders-plugin';
import { environment, MessageBusChannelsEnum, RabbitExchangesEnum } from '../../environments';
import { PaymentLinksSchema } from '../../mongoose-schema/schemas/payment-links.schema';
import { PaymentLinkSchemaName } from '../../mongoose-schema';
import { FiltersConfig } from './filters-config';
import { ElasticPaymentLinksEnum, ElasticMappingFieldsConfig } from '../enums';
import { mapPaymentLinkFolderItem } from '../transformers';

export const PaymentLinksFoldersConfig: FoldersPluginOptionsInterface<any> = {
  combinedList: false,
  documentSchema: {
    map: mapPaymentLinkFolderItem,
    schema: PaymentLinksSchema,
    schemaName: PaymentLinkSchemaName,
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
      createdAtField: 'createdAt',
      documentIdField: '_id',
      elasticIndex: ElasticPaymentLinksEnum.index,
      type: ElasticPaymentLinksEnum.type,
    },

    mappingFields: ElasticMappingFieldsConfig,
    searchFields: [],
    storeFields: [],
  },

  filters: FiltersConfig,
  microservice: 'checkout',
  rabbitConfig: {
    documentConsumer: {
      exchange: RabbitExchangesEnum.checkoutFolders,
      rabbitChannel: MessageBusChannelsEnum.checkoutFolders,
    },
    exportConsumer: {
      exchange: RabbitExchangesEnum.checkoutFoldersExport,
      rabbitChannel: MessageBusChannelsEnum.checkoutFoldersExport,
    },
  },
  redisConfig: environment.redis,
  useBusiness: true,
  useDefaultBusinessFolder: true,
  useStrictUserScope: false,
  useUserScope: false,
};
