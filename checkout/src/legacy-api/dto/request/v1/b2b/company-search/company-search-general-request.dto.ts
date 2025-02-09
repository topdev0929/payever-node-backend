import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CompanySearchGeneralRequestDto {
  @Expose()
  @IsOptional()
  @IsString()
  public type?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public external_id?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public vat_id?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public registration_id?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  public get_legal_form?: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  public get_credit_line?: boolean;
}
