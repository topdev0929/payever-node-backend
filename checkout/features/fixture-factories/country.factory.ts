/* eslint-disable-no-identical-functions no-duplicate-string object-literal-sort-keys */
import { CountryInterface } from '@pe/common-sdk';
import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';

type CountryType = CountryInterface & { _id: string };

const LocalFactory: DefaultFactory<CountryType> = (): CountryType => {
  return {
    _id: 'DE',
    capital: 'Berlin',
    continent: 'EU',
    currencies: [
      'EUR',
    ],
    flagEmoji: '🇩🇪',
    flagUnicode: 'U+1F1E9 U+1F1EA',
    languages: [
      'de',
    ],
    name: 'Germany',
    nativeName: 'Deutschland',
    phoneCode: 49,
  };
};

export class CountryFactory {
  public static create: PartialFactory<CountryType> = partialFactory<CountryType>(LocalFactory);

  public static createDefaultCountries(): CountryType[] {
    const countries: CountryType[] = [];
    countries.push(this.createGermanyCountry());
    countries.push(this.createGreatBritainCountry());
    countries.push(this.createSwedenCountry());
    countries.push(this.createDenmarkCountry());
    countries.push(this.createNorwayCountry());
    countries.push(this.createSpainCountry());
    countries.push(this.createRussiaCountry());

    return countries;
  }

  public static createGermanyCountry(): CountryType {
    return this.create({
      _id: 'DE',
      capital: 'Berlin',
      continent: 'EU',
      currencies: [
        'EUR',
      ],
      flagEmoji: '🇩🇪',
      flagUnicode: 'U+1F1E9 U+1F1EA',
      languages: [
        'de',
      ],
      name: 'Germany',
      nativeName: 'Deutschland',
      phoneCode: 49,
    });
  }

  public static createDenmarkCountry(): CountryType {
    return this.create({
      _id: 'DK',
      capital: 'Copenhagen',
      continent: 'EU',
      currencies: [
        'DKK',
      ],
      flagEmoji: '🇩🇰',
      flagUnicode: 'U+1F1E9 U+1F1F0',
      languages: [
        'da',
      ],
      name: 'Denmark',
      nativeName: 'Danmark',
      phoneCode: 45,
    });
  }

  public static createSpainCountry(): CountryType {
    return this.create({
      _id: 'ES',
      capital: 'Madrid',
      continent: 'EU',
      currencies: [
        'EUR',
      ],
      flagEmoji: '🇪🇸',
      flagUnicode: 'U+1F1EA U+1F1F8',
      languages: [
        'es',
        'eu',
        'ca',
        'gl',
        'oc',
      ],
      name: 'Spain',
      nativeName: 'España',
      phoneCode: 34,
    });
  }

  public static createGreatBritainCountry(): CountryType {
    return this.create({
      _id: 'GB',
      capital: 'London',
      continent: 'EU',
      currencies: [
        'GBP',
      ],
      flagEmoji: '🇬🇧',
      flagUnicode: 'U+1F1EC U+1F1E7',
      languages: [
        'en',
      ],
      name: 'United Kingdom',
      nativeName: 'United Kingdom',
      phoneCode: 44,
    });
  }

  public static createNorwayCountry(): CountryType {
    return this.create({
      _id: 'NO',
      capital: 'Oslo',
      continent: 'EU',
      currencies: [
        'NOK',
      ],
      flagEmoji: '🇳🇴',
      flagUnicode: 'U+1F1F3 U+1F1F4',
      languages: [
        'no',
        'nb',
        'nn',
      ],
      name: 'Norway',
      nativeName: 'Norge',
      phoneCode: 47,
    });
  }

  public static createSwedenCountry(): CountryType {
    return this.create({
      _id: 'SE',
      capital: 'Stockholm',
      continent: 'EU',
      currencies: [
        'SEK',
      ],
      flagEmoji: '🇸🇪',
      flagUnicode: 'U+1F1F8 U+1F1EA',
      languages: [
        'sv',
      ],
      name: 'Sweden',
      nativeName: 'Sverige',
      phoneCode: 46,
    });
  }

  public static createRussiaCountry(): CountryType {
    return this.create({
      _id: 'RU',
      capital: 'Moscow',
      continent: 'EU',
      currencies: [
        'RUB',
      ],
      flagEmoji: '🇷🇺',
      flagUnicode: 'U+1F1F7 U+1F1FA',
      languages: [
        'ru',
      ],
      name: 'Russia',
      nativeName: 'Россия',
      phoneCode: 7,
    });
  }
}
