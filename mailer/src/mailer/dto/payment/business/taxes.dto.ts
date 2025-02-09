import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class TaxesDto {
  @IsString()
  @IsOptional()
  public companyRegisterNumber: string;

  @IsString()
  @IsOptional()
  public taxId: string;

  @IsString()
  @IsOptional()
  public taxNumber: string;

  @IsBoolean()
  @IsOptional()
  public turnoverTaxAct: boolean;
}
