import * as VATRates from 'vatrates';
import { v4 as uuid } from 'uuid';
import { BaseFixture } from '@pe/cucumber-sdk';

class TaxesFixture extends BaseFixture {
  public async apply(): Promise<void> {

    const vatRates: any = new VATRates(new Date());

    await this.connection.collection('taxes').insertOne({
      _id: 'f1e18c0c-5b36-4287-9c62-aeb28e174071',
      country: 'UK',
      description: 'some description',
      rate: 12.34,
    });
    for (const vatCountry of vatRates.getCountries()) {
      const countryCode: string = vatCountry.getCountryCode();

      const countryTaxes: Array<{ country: string, description: string, rate: number}> = [];

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

      if (vatRates.getSuperReducedRate(countryCode)) {
        countryTaxes.push({
          country: countryCode,
          description: 'Super-reduced VAT rate',
          rate: vatRates.getSuperReducedRate(countryCode),
        });
      }

      if (vatRates.getParkingRate(countryCode)) {
        countryTaxes.push({
          country: countryCode,
          description: 'Parking VAT rate',
          rate: vatRates.getParkingRate(countryCode),
        });
      }

      for (const tax of countryTaxes) {
        await this.connection.collection('taxes').insertOne({
          _id: uuid(),
          country: tax.country,
          description: tax.description,
          rate: tax.rate,
        });
      }
    }
  }
}

export = TaxesFixture;
