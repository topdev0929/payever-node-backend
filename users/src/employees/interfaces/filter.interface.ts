import { Conditions } from '../enum';

export interface Filter {
  identifier: Conditions;
  applyFilter(value: any): any;
}
