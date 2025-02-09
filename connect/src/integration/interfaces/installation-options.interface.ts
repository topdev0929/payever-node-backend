import { LinkInterface } from './link.interface';
import { TranslationsInterface } from './translations.interface';

export interface InstallationOptionsInterface {
  readonly optionIcon: string;
  readonly price: string;
  readonly links: LinkInterface[];
  readonly countryList: string[];
  readonly category: string;
  readonly developer: string;
  readonly developerTranslations?: TranslationsInterface;
  readonly languages: string;
  readonly description: string;
  readonly appSupport: string;
  readonly website: string;
  readonly pricingLink: string;
  readonly wrapperType?: string;
}
