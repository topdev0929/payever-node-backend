import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDefined, IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty()
  @IsDefined()
  @IsOptional()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsDefined()
  @IsOptional()
  @IsString()
  public streetName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public streetNumber: string;

  @ApiProperty()
  @IsDefined()
  @IsOptional()
  @IsString()
  public city: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public stateProvinceCode: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsDefined()
  public zipCode: string;

  @ApiProperty()
  @IsDefined()
  @IsOptional()
  @IsString()
  public countryCode: string;
}
