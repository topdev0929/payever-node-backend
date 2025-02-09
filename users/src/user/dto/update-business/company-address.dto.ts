import { ApiProperty } from '@nestjs/swagger';
import { IsCountryCode } from '@pe/common-sdk';
import { IsOptional, IsString } from 'class-validator';
import { CompanyAddressInterface } from '../../interfaces';

export class CompanyAddressDto implements CompanyAddressInterface {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsCountryCode()
  public country: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public city: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public street: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public zipCode: string;
}
