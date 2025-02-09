import * as VATRates from 'vatrates';
import { v4 as uuid } from 'uuid';
const COLLECTION_NAME: string = 'taxes';

export async function up(db: any): Promise<void> {

  const vatRates: VATRates = new VATRates(new Date());

  for (const vatCountry of vatRates.getCountries()){
    const countryCode: string = vatCountry.getCountryCode();

    const countryTaxes: Array<{country: string, description: string, rate: number}> = [];

    countryTaxes.push({
      country: countryCode,
      description: 'Standard VAT rate',
      rate: vatRates.getStandardRate(countryCode),
    });

    if (vatRates.getReducedRates(countryCode)) {
      for (const reducedRate of vatRates.getReducedRates(countryCode)) {
        countryTaxes.push({
          country: countryCode,
          description: 'Reduced VAT rate',
          rate: reducedRate,
        });
      }
    }

    if(vatRates.getSuperReducedRate(countryCode)) {
      countryTaxes.push({
        country: countryCode,
        description: 'Super-reduced VAT rate',
        rate: vatRates.getSuperReducedRate(countryCode),
      });
    }

    if(vatRates.getParkingRate(countryCode)) {
      countryTaxes.push({
        country: countryCode,
        description: 'Parking VAT rate',
        rate: vatRates.getParkingRate(countryCode),
      });
    }

    for (const tax of countryTaxes) {
      db._run(
        'insert',
        COLLECTION_NAME,
        {
          _id: uuid(),
          country: tax.country,
          description: tax.description,
          rate: tax.rate,
        },
      );
    }
  }

  return null;
}

export function down(): Promise<void> {
  return null;
}
