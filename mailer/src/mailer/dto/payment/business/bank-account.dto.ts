import { IsString, IsOptional } from 'class-validator';

export class BankAccountDto {
  @IsString()
  @IsOptional()
  public country: string;

  @IsString()
  @IsOptional()
  public city: string;

  @IsString()
  @IsOptional()
  public bankName: string;

  @IsString()
  @IsOptional()
  public bankCode: string;

  @IsString()
  @IsOptional()
  public swift: string;

  @IsString()
  @IsOptional()
  public routingNumber: string;

  @IsString()
  @IsOptional()
  public accountNumber: string;

  @IsString()
  @IsOptional()
  public owner: string;

  @IsString()
  @IsOptional()
  public bic: string;

  @IsString()
  @IsOptional()
  public iban: string;
}
