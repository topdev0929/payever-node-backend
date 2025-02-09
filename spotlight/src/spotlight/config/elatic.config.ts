import { AnalyzerEnum } from '../enums';
import { ElasticConfigInterface } from '../interfaces';

export const elasticConfig: ElasticConfigInterface = {
  index: {
    elasticIndex: `spotlight`,
  },
  mappingFields: {
    app: {
      type: 'text',
    },
    businessId: {
      type: 'keyword',
    },
    description: {
      fielddata: true,
      fields: {
        keyword: {
          normalizer: 'case_insensitive',
          type: 'keyword',
        },
      },
      type: 'text',
      analyzer: AnalyzerEnum.Autocomplete,
    },
    contact: {
      fields: {
        keyword: {
          normalizer: 'case_insensitive',
          type: 'keyword',
        },
      },
      analyzer: AnalyzerEnum.Autocomplete,
      type: 'text',
    },
    icon: {
      type: 'text',
    },
    owner: {
      type: 'object',
      properties: {
        email: {
          analyzer: AnalyzerEnum.Autocomplete,
          type: 'text',
          fields: {
            keyword: {
              normalizer: 'case_insensitive',
              type: 'keyword',
            },
          },
        },
      },
    },
    ownerId: {
      type: 'text',
    },
    salt: {
      type: 'text',
    },
    serviceEntityId: {
      type: 'keyword',
    },
    subType: {
      type: 'text',
    },
    title: {
      fielddata: true,
      fields: {
        keyword: {
          normalizer: 'case_insensitive',
          type: 'keyword',
        },
      },
      type: 'text',
    },
  },
  searchFields: [
    'app^1',
    'businessId^1',
    'description^1',
    'contact^1',
    'serviceEntityId^1',
    'subType^1',
    'title^1',
    'owner',
    'ownerId^1',
  ],
  storeFields: [
    'app',
    'businessId',
    'description',
    'contact',
    'salt',
    'serviceEntityId',
    'subType',
    'title',
    'owner',
    'ownerId',
  ],
};
