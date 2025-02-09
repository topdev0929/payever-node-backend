import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import * as countryList from 'country-list';

@ValidatorConstraint({ name: 'country', async: false })
export class CountryValidator implements ValidatorConstraintInterface {
  public validate(text: string, args: ValidationArguments): boolean {
    return !!countryList.getName(text);
  }

  public defaultMessage(args: ValidationArguments): string {
    return '($value) should be an ISO 3166-1-alpha-2 country code!';
  }
}
