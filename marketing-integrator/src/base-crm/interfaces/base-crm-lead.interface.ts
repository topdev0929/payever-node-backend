import { BaseCrmContactAwareInterface } from '.';

export interface BaseCrmLeadInterface extends BaseCrmContactAwareInterface {
  status: string;
  source_id?: number;
  organization_name?: string;
}
