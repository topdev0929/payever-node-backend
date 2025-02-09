import * as cc from 'currency-codes';
import * as currenciesMap from 'currency-symbol-map/map'

const COLLECTION_NAME: string = 'currencies';
const excludeCodes: string[] = [
  'XXX', 'XTS',
];

export async function up(db: any): Promise<void> {
  for (const currencyCode of cc.codes()) {
    if (excludeCodes.indexOf(currencyCode) > -1 ) {
      continue;
    }

    const currency: cc.CurrencyCodeRecord = cc.code(currencyCode);
    if (currenciesMap[currencyCode]) {
      db._run(
        'update',
        COLLECTION_NAME,
        {
          options: { upsert: true },
          query: {
            _id: currencyCode,
          },
          update: {
            $set: {
              _id: currencyCode,
              name: currency.currency,
              symbol: currenciesMap[currencyCode] ? currenciesMap[currencyCode] : null,
            },
          },
        },
      );
    }
  }

  return null;
}

export function down(): Promise<void> {
  return null;
}
