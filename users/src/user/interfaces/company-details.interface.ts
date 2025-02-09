import { RangeInterface } from './range-interface';
import { StatusEnum } from '../enums';

export interface CompanyDetailsInterface {
  readonly businessStatus: string;
  readonly legalForm: string;
  readonly phone?: string;
  readonly product?: string;
  readonly industry?: string;
  readonly urlWebsite?: string;
  readonly foundationYear?: string;
  readonly employeesRange: RangeInterface;
  readonly salesRange: RangeInterface;
  readonly status?: StatusEnum;
}
