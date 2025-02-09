import { MeasureFilterInterface } from '../interfaces';

export interface MeasureInterface {
  sql: string;
  type: string;
  format?: string;
  filters?: MeasureFilterInterface[];
}
