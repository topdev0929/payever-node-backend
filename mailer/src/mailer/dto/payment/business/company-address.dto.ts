import { IsString, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';

export class CompanyAddressDto {
  @IsOptional()
  @IsString()
  public country: string;

  @IsString()
  @IsOptional()
  public city: string;

  @IsString()
  @IsOptional()
  public street: string;

  @IsString()
  @IsOptional()
  @Expose({ name: 'zip_code' })
  public zipCode: string;
}
