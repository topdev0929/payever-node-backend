import { Injectable } from '@nestjs/common';
import { countries, Country } from 'countries-list';
import { CURRENCIES, DEFAULT_CURRENCY, DEFAULT_LANGUAGE, LANGUAGES } from '../constants';

@Injectable()
export class CountryInfoService {
  public getCountryInfo(isoCountryCode: string): Country {
    if (!isoCountryCode) {
      return null;
    }

    return countries[isoCountryCode.toUpperCase()] || null;
  }

  public getCountryCurrency(isoCountryCode: string): string {
    const countryInfo: Country = this.getCountryInfo(isoCountryCode);

    return countryInfo && countryInfo.currency
      ? (CURRENCIES.find((item: string) => item === countryInfo.currency.toUpperCase()) || DEFAULT_CURRENCY)
      : DEFAULT_CURRENCY
    ;
  }

  public getCountryLanguage(isoCountryCode: string): string {
    const countryInfo: Country = this.getCountryInfo(isoCountryCode);

    const language: string = countryInfo && countryInfo.languages && countryInfo.languages.length
      ? LANGUAGES.find((item: string) => item === countryInfo.languages[0])
      : DEFAULT_LANGUAGE;

    return  language ? language : DEFAULT_LANGUAGE;
  }
}
