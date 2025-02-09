import { TermsFormInterface } from './terms-form.interface';

export interface TermsInterface {
  legal_text?: string;
  channel?: string;
  channel_type?: string;
  form?: TermsFormInterface[];
  default: boolean;
  hasRemoteTerms?: boolean;
}
