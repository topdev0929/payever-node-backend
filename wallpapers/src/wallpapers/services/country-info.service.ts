import { Injectable } from '@nestjs/common';
import { countries } from 'countries-list';

@Injectable()
export class CountryInfoService {
  public getCountryCode(countryName: string): string | null {
    for (const key in countries) {
      if (countries[key].name.toLowerCase() === countryName.toLowerCase()) {
        return key;
      }
    }

    return null;
  }
}
