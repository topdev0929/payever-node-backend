import { IsString, IsOptional } from 'class-validator';

export class CompanyDetailsDto {
  @IsString()
  @IsOptional()
  public legalForm: string;

  @IsString()
  @IsOptional()
  public product: string;

  @IsString()
  @IsOptional()
  public industry: string;

  @IsString()
  @IsOptional()
  public urlWebsite: string;

  @IsString()
  @IsOptional()
  public foundationYear: string;
}
