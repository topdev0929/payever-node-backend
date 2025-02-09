import { IsOptional, IsString } from 'class-validator';

export class TransactionSellerDto  {
  @IsString()
  @IsOptional()
  public id?: string;

  @IsString()
  @IsOptional()
  public first_name?: string;

  @IsString()
  @IsOptional()
  public last_name?: string;

  @IsString()
  @IsOptional()
  public email?: string;

}
