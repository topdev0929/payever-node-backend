import {
  FilterFieldCondition,
  NestedFieldConditionEnum,
  NumberFieldConditionEnum,
  ObjectFieldConditionEnum,
  StringFieldConditionEnum,
} from '@pe/nest-kit';

export * from './elastic-mapping-fields.config';
export * from './elastic-product.enum';
export * from './elastic-product-relations.enum';
export * from './product-type.enum';
export * from './product-filter-field.enum';
export * from './notifications.enums';
export * from './products-events.enum';
export * from './service-tags.enum';
export * from './recommendation-tags.enum';
export * from './option-type.enum';
export * from './price-condition-field.enum';
export * from './product-condition.enum';
export * from './product-special-context.enum';
export * from './filter-type-by-business.enum';

export enum ExtraFilterFieldCondition {
  isIn = 'isIn',
}

export type AllFilterFieldCondition = FilterFieldCondition | ExtraFilterFieldCondition;

export const AllFilterFieldConditionObject: { [key: string]: string } = {
  ...StringFieldConditionEnum,
  ...NumberFieldConditionEnum,
  ...NestedFieldConditionEnum,
  ...ObjectFieldConditionEnum,
  ...ExtraFilterFieldCondition,
};
