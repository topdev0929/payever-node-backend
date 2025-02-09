import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDefined, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  public streetName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public streetNumber: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  public city: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public stateProvinceCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  public zipCode: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  public countryCode: string;
}
