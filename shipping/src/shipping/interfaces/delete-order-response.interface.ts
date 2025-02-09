import { ValidateResponseErrorInterface } from './validate-response-error.interface';

export interface DeleteOrderResponseInterface {
  status?: boolean;
  errors?: ValidateResponseErrorInterface[];
}
