import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { BoxTypesEnums, DimensionUnitEnums, WeightUnitEnums } from '../enums';
import { BoxKindsEnums } from '../enums/box-kind.enum';

export class UpdateShippingBoxDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public business: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(DimensionUnitEnums)
  public dimensionUnit: DimensionUnitEnums;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(WeightUnitEnums)
  public weightUnit: WeightUnitEnums;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BoxKindsEnums)
  public kind: BoxKindsEnums;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  public length: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  public width: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  public height: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  public weight: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(BoxTypesEnums)
  public readonly type: BoxTypesEnums;
}
