import { CheckoutSectionInterface } from '..';

export interface CheckoutFlowUiInterface {
  logo: string;
  sections: CheckoutSectionInterface[];
  styles: { };
  uuid: string;
  version: string;
}
