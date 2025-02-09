import { 
  IsEmail, 
  IsOptional, 
  IsString, 
} from 'class-validator';

export class TransactionsCustomerDto{

  @IsOptional()
  @IsEmail()
  public email: string;

  @IsOptional()
  @IsString()
  public name: string;
}
