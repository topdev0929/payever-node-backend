import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { WidgetSettingDto } from '../dto';
import { WidgetTypeEnum } from '../enums';
import { SizeValueEnum, ViewTypeValueEnum } from '../enums/wigdet-setting-type-values';

export class CreateWidgetDto {
  @ApiPropertyOptional()
  @IsString()
  public name: string;

  @ApiPropertyOptional()
  @IsString()
  public size: SizeValueEnum; 

  @ApiProperty({ enum: WidgetTypeEnum })
  @IsNotEmpty()
  @IsEnum(WidgetTypeEnum)
  public type: WidgetTypeEnum;

  @ApiProperty({ enum: ViewTypeValueEnum })
  @IsNotEmpty()
  @IsEnum(ViewTypeValueEnum)
  public viewType: WidgetTypeEnum;
  
  @ApiProperty()
  @IsNotEmpty()
  public widgetSettings: WidgetSettingDto[] | WidgetSettingDto[][] | WidgetSettingDto[][][];
}
