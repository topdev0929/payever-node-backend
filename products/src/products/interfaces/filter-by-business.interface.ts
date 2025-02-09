import { PropertiesFilter } from './properties-filter.interface';

export interface FilterByBusinessInterface {
  attributes: PropertiesFilter;
  categories: PropertiesFilter;
  price: PropertiesFilter;
  type: PropertiesFilter;
  variants: PropertiesFilter;
  brands: PropertiesFilter;
  condition: PropertiesFilter;
}
