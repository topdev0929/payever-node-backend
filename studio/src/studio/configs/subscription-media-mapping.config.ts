import { ElasticFieldConfigInterface } from '@pe/elastic-kit/module/interfaces/elastic-field-config.interface';

export const SubscriptionMediaMapping: { [field: string]: ElasticFieldConfigInterface } = {
  attributes: {
    properties: {
      name: {
        type: 'keyword',
      },
      value: {
        type: 'keyword',
      },
    },
    type: 'nested',
  },
  mediaType: {
    type: 'keyword',
  },
  name: {
    type: 'keyword',
  },
  subscriptionType: {
    type: 'integer',
  },
  url: {
    type: 'keyword',
  },
};
