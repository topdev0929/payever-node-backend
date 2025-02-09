import { BaseCrmContactAddressInterface } from '.';

export interface BaseCrmContactAwareInterface {
  last_name?: string;
  first_name?: string;
  id?: number;
  creator_id?: number;
  owner_id?: number;
  title?: string;
  country?: string;
  description?: string;
  industry?: string;
  website?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  skype?: string;
  address?: BaseCrmContactAddressInterface;
  tags?: string[];
  custom_fields?: {
    Apps?: string[];
    Registered?: string;
    'Business Id'?: string;
    Product?: string[];
    'Transaction Volume'?: number;
    'Transaction Amount'?: number;
    'Pilot'?: string;
    [k: string]: any;
  };
  created_at?: string;
  updated_at?: string;
}
