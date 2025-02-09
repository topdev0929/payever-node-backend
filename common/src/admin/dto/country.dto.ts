import { CountryDto as CountryDtoSDK } from '@pe/common-sdk';
import { IsNotEmpty } from 'class-validator';

export class CountryDto extends CountryDtoSDK {
  @IsNotEmpty()
  public languages: string[]; // Perhaps it should be changed in CountryDtoSDK as well
}
