type fieldConfig = {
  type: string;
  fielddata?: boolean;
};

export const ElasticMappingFieldsConfig: { [field: string]: fieldConfig } = {
  amount: {
    type: 'long',
  },
  businessId: {
    fielddata: true,
    type: 'text',
  },
  createdAt: {
    type: 'date',
  },
  expiresAt: {
    type: 'date',
  },
  isActive: {
    type: 'boolean',
  },
  isDeleted: {
    type: 'boolean',
  },
  transactionsCount: {
    type: 'number',
  },
  viewsCount: {
    type: 'number',
  },
};
