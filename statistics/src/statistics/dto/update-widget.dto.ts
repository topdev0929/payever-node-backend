import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsArray, IsString, IsEnum } from 'class-validator';
import { WidgetSettingInterface } from '../interfaces';
import { WidgetTypeEnum } from '../enums/widget-type.enum';
import { ViewTypeValueEnum } from '../enums/wigdet-setting-type-values/view-type-value.enum';
import { SizeValueEnum } from '..';

export class UpdateWidgetDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public name: string;

  @ApiProperty()
  @IsEnum(SizeValueEnum)
  @IsOptional()
  public size: SizeValueEnum;

  @ApiProperty()
  @IsEnum(WidgetTypeEnum)
  @IsOptional()
  public type: WidgetTypeEnum;


  @ApiProperty()
  @IsEnum(ViewTypeValueEnum)
  @IsOptional()
  public viewType: ViewTypeValueEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  public widgetSettings: WidgetSettingInterface[] | WidgetSettingInterface[][] | WidgetSettingInterface[][][];
}
