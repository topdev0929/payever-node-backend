import { ElasticProductRelationsEnum } from './elastic-product-relations.enum';

export const ElasticMappingFieldsConfig: { [field: string]: { } } = {
  active: { type: 'text'},
  barcode: { type: 'text'},
  businessUuid: { fielddata: true, type: 'text'},
  categories: {
    properties: {
      title : {
        fielddata: true,
        type: 'text',
      },
    },
    type: 'nested',
  },
  'channelSets.id': { type: 'text' },
  'channelSets.name': { type: 'text' },
  'channelSets.type': { type: 'text' },
  company: { type: 'text' },
  country: { type: 'text' },
  currency: { type: 'text'},
  description: { type: 'text'},
  images: { type: 'text'},
  isLocked: { type: 'boolean'},
  language: { type: 'text' },
  mongoId: { type: 'keyword'},
  onSales: { type: 'boolean'},
  price: { type: 'long'},
  product: { type: 'keyword'},
  product_relations: {
    relations: {
      [ElasticProductRelationsEnum.parentProduct]: ElasticProductRelationsEnum.variant,
    },
    type: 'join',
  },
  salePrice: { type: 'long'},
  'shipping.height': { type: 'long'},
  'shipping.length': { type: 'long'},
  'shipping.measure_mass': { type: 'text'},
  'shipping.measure_size': { type: 'text'},
  'shipping.weight': { type: 'long'},
  'shipping.width': { type: 'long'},
  sku: { type: 'text'},
  title: { type: 'text', fielddata: true},
  type: { type: 'text'},
  vatRate:  { type: 'long'},
};
