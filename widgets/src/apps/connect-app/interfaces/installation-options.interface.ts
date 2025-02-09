import { LinkInterface } from './link.interface';

export interface InstallationOptionsInterface {
  readonly optionIcon: string;
  readonly price: string;
  readonly links: LinkInterface[];
  readonly countryList: string[];
  readonly category: string;
  readonly developer: string;
  readonly languages: string;
  readonly description: string;
  readonly appSupport: string;
  readonly website: string;
  readonly pricingLink: string;
}
