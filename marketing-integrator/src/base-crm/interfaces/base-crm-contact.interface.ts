import { BaseCrmContactAwareInterface, BaseCrmContactAddressInterface } from '.';
import { BaseCrmContactCustomerStatus, BaseCrmContactProspectStatus } from '../enum';

export interface BaseCrmContactInterface extends BaseCrmContactAwareInterface {
  name?: string;
  is_organization?: boolean;
  contact_id?: number;
  parent_organization_id?: number;
  customer_status?: BaseCrmContactCustomerStatus;
  prospect_status?: BaseCrmContactProspectStatus;
  billing_address?: BaseCrmContactAddressInterface;
  shipping_address?: BaseCrmContactAddressInterface;
}
