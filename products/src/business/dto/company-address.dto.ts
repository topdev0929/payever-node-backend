import { IsString, IsNotEmpty } from 'class-validator';

export class CompanyAddressDto {
  @IsString()
  @IsNotEmpty()
  public country: string;

  @IsString()
  @IsNotEmpty()
  public city: string;

  @IsString()
  @IsNotEmpty()
  public street: string;

  @IsString()
  @IsNotEmpty()
  public zipCode: string;
}
