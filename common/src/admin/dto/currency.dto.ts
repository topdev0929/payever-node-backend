import { CurrencyDto as CurrencyDtoSDK } from '@pe/common-sdk';
import { IsOptional } from 'class-validator';

export class CurrencyDto extends CurrencyDtoSDK {
  @IsOptional()
  public code: string; // Perhaps it should be deleted from CurrencyDtoSDK and then from here.
}
