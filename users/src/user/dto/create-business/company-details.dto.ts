import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CompanyDetailsInterface } from '../../interfaces';
import { RangeDto } from './range.dto';
import { StatusEnum } from '../../enums';

export class CompanyDetailsDto implements CompanyDetailsInterface {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public businessStatus: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public legalForm: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public product: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public industry: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public urlWebsite: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public foundationYear: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => RangeDto)
  @ValidateNested()
  public employeesRange: RangeDto;

  @ApiProperty()
  @IsOptional()
  @Type(() => RangeDto)
  @ValidateNested()
  public salesRange: RangeDto;

  @ApiProperty()
  @IsEnum(StatusEnum)
  @IsOptional()
  public status?: StatusEnum;
}
