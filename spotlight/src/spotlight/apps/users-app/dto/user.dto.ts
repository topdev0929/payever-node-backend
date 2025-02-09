import { IsNotEmpty, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { UserAccountDto } from './user-account.dto';


export class UserDto {
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @IsArray()
  public businesses: any[];

  @Type(() => UserAccountDto)
  @ValidateNested()
  public userAccount: UserAccountDto;
}


