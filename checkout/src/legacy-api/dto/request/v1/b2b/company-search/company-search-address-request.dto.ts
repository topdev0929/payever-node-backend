import { IsOptional, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CompanySearchAddressRequestDto {
  @Expose()
  @IsOptional()
  @IsString()
  public city?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public country?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public phone?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public street_name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public street_number?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public zip?: string;
}
