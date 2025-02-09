import { ValidateResponseErrorInterface } from './validate-response-error.interface';

export interface CreateOrderResponseInterface {
  status?: boolean;
  shipmentNumber: string;
  trackingUrl?: string;
  label: string;
  errors?: ValidateResponseErrorInterface[];
}
