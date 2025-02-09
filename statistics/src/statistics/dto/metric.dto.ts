import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested, IsEnum, IsArray } from 'class-validator';
import { MetricInterface } from '../interfaces';
import { MetricEnum, SizeValueEnum, WidgetTypeEnum } from '../enums';

export class MetricDto implements MetricInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(MetricEnum)
  public name: MetricEnum;

  @ApiProperty()
  @ValidateNested()
  @IsArray()
  @IsNotEmpty()
  @IsEnum(SizeValueEnum)
  public sizes: SizeValueEnum[];

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(WidgetTypeEnum)
  public types: WidgetTypeEnum[];
}
