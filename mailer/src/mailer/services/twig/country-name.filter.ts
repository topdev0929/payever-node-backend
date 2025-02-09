import { CountryModel } from '@pe/common-sdk';

export class CountryNameFilter {
  public static filter(code: string, countries: CountryModel[]): string {
    const country: CountryModel | undefined = countries.find((_country: CountryModel) => _country._id === code);

    if (country) {
      return country.name;
    }

    return code;
  }
}
