import {Country, countries as countriesList} from 'countries-list';
import * as currenciesMap from 'currency-symbol-map/map'

const COLLECTION_NAME: string = 'countries';

export async function up(db: any): Promise<void> {
  for (const countryCode of Object.keys(countriesList)) {
    const country: Country = countriesList[countryCode];
    db._run(
      'update',
      COLLECTION_NAME,
      {
        options: { upsert: true },
        query: {
          _id: countryCode,
        },
        update: {
          $set: {
            _id: countryCode,
            capital: country.capital,
            continent: country.continent,
            currencies: country.currency.split(',').filter(
              (code: string) => currenciesMap[code] !== undefined && currenciesMap[code] !== null,
            ),
            flagEmoji: country.emoji,
            flagUnicode: country.emojiU,
            languages: country.languages,
            name: country.name,
            nativeName: country.native,
            phoneCode: country.phone,
          },
        },
      },
    );
  }

  return null;
}

export function down(): Promise<void> {
  return null;
}
