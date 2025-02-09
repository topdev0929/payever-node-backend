import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CompanyAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public street: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public zip: string;
}
