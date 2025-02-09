import { FilterTypeByBusinessEnum } from '../enums';
import { OptionOfFilter } from './option-of-filter.interface';

export interface PropertiesFilter {
  defaultValue: OptionOfFilter;
  type: FilterTypeByBusinessEnum;
  options: OptionOfFilter[];
}
