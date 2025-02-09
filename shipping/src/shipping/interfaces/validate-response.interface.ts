import { ValidateResponseErrorInterface } from './validate-response-error.interface';

export interface ValidateResponseInterface {
  status: boolean;
  state: any;
  errors?: ValidateResponseErrorInterface[];
}
