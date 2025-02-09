import { FoldersPluginOptionsInterface } from '@pe/folders-plugin';
import { MappingHelper } from '../transactions/helpers';
import { RabbitChannels, RabbitExchangesEnum } from '../enums';
import { environment } from '../environments';
import { TransactionSchemaName, TransactionSchema } from '../transactions/schemas';
import { FiltersConfig } from './filters-config';

export const FoldersConfig: FoldersPluginOptionsInterface<any> = {
  combinedList: false,
  documentSchema: {
    /* eslint @typescript-eslint/unbound-method: 0 */
    map: MappingHelper.map,
    schema: TransactionSchema,
    schemaName: TransactionSchemaName,
  },
  elastic: {
    env: {
      elasticSearchAuthPassword: environment.elasticSearchAuthPassword,
      elasticSearchAuthUsername: environment.elasticSearchAuthUsername,
      elasticSearchCloudId: environment.elasticSearchCloudId,
      elasticSearchHost: environment.elasticSearchHost,
    },

    index: {
      businessIdField: 'business_uuid',
      createdAtField: 'created_at',
      documentIdField: 'uuid',
      elasticIndex: 'folder_transactions',
      type: 'folder_transaction',
      userIdField: 'user_uuid',
    },

    mappingFields: {
      channel: {
        fielddata: true,
        type: 'text',
      },
      channel_source: {
        fielddata: true,
        type: 'text',
      },
      channel_type: {
        fielddata: true,
        type: 'text',
      },
      created_at: {
        type: 'date',
      },
      currency: {
        fielddata: true,
        fields: {
          keyword: {
            type: 'keyword',
          },
        },
        type: 'text',
      },
      customer_email: {
        fielddata: true,
        fields: {
          keyword: {
            normalizer: 'case_insensitive',
            type: 'keyword',
          },
        },
        type: 'text',
      },
      customer_name: {
        fielddata: true,
        fields: {
          keyword: {
            normalizer: 'case_insensitive',
            type: 'keyword',
          },
        },
        type: 'text',
      },
      customer_psp_id: {
        type: 'text',
      },
      item_thumbnail: {
        type: 'text',
      },
      merchant_email: {
        fielddata: true,
        fields: {
          keyword: {
            normalizer: 'case_insensitive',
            type: 'keyword',
          },
        },
        type: 'text',
      },
      merchant_name: {
        fielddata: true,
        fields: {
          keyword: {
            normalizer: 'case_insensitive',
            type: 'keyword',
          },
        },
        type: 'text',
      },
      original_id: {
        type: 'keyword',
      },
      plugin_version: {
        fielddata: true,
        type: 'text',
      },
      reference: {
        fielddata: true,
        type: 'text',
      },
      seller_email: {
        fielddata: true,
        fields: {
          keyword: {
            normalizer: 'case_insensitive',
            type: 'keyword',
          },
        },
        type: 'text',
      },
      seller_id: {
        fielddata: true,
        fields: {
          keyword: {
            normalizer: 'case_insensitive',
            type: 'keyword',
          },
        },
        type: 'text',
      },
      seller_name: {
        fielddata: true,
        fields: {
          keyword: {
            normalizer: 'case_insensitive',
            type: 'keyword',
          },
        },
        type: 'text',
      },
      specific_status: {
        fielddata: true,
        fields: {
          keyword: {
            type: 'keyword',
          },
        },
        type: 'text',
      },
      status: {
        fielddata: true,
        fields: {
          keyword: {
            type: 'keyword',
          },
        },
        type: 'text',
      },
      total_left: {
        type: 'long',
      },
      type: {
        fielddata: true,
        type: 'text',
      },
    },

    searchFields: [
      'original_id^1',
      'customer_name^1',
      'merchant_name^1',
      'reference^1',
      'customer_email^1',
    ],

    storeFields: [
    ],
  },

  filters: FiltersConfig,
  microservice: 'transactions',
  rabbitConfig: {
    documentConsumer: {
      exchange: RabbitExchangesEnum.transactionsFolders,
      rabbitChannel: RabbitChannels.TransactionsFolders,
    },
    exportConsumer: {
      exchange: RabbitExchangesEnum.transactionsFoldersExport,
      rabbitChannel: RabbitChannels.TransactionsFoldersExport,
    },
  },
  redisConfig: environment.redis,
  useBusiness: true,
  useStrictUserScope: false,
  useUserScope: true,
};
