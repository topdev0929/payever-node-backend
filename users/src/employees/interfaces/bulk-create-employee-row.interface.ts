import { Status } from '../enum';
import { Positions } from '../enum/positions.enum';

export interface BulkCreateEmployeeRowInterface {
  'User Id'?: string;
  'Email': string;
  'First Name'?: string;
  'Last Name'?: string;
  'Position'?: Positions;
  'Company Name'?: string;
  'Phone Number'?: string;
  'Status'?: Status;
  'Logo'?: string;
  'Country'?: string;
  'City'?: string;
  'State'?: string;
  'Street'?: string;
  'Zipcode'?: string;
}
