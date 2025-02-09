import { UserAccountInterface } from '../interfaces';
import { IsOptional, IsString } from 'class-validator';

export class UserAccountDto implements UserAccountInterface {
  @IsOptional()
  @IsString()
  public email?: string;
}
