import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { DimensionInterface } from '../interfaces';
import { DimensionEnum, SizeValueEnum, WidgetTypeEnum } from '../enums';

export class DimensionDto implements DimensionInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(DimensionEnum)
  public name: DimensionEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public field: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(SizeValueEnum)
  public sizes: SizeValueEnum[];

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(SizeValueEnum)
  public types: WidgetTypeEnum[];
}
