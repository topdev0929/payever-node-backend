import { IsString, ValidateNested } from 'class-validator';
import { BusinessDto, UserAccountDto } from './business';

export class AccountDto {
  @IsString()
  public _id: string;

  @ValidateNested()
  public userAccount: UserAccountDto;

  @ValidateNested()
  public businesses: BusinessDto[];
}
