interface FieldConfig {
  type: string;
}

export const ElasticMappingFieldsConfig: { [field: string]: FieldConfig } = {
  partnerTags: { type: 'text' },
};
