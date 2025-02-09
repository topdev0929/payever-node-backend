import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested, IsString, IsEnum } from 'class-validator';
import { WidgetInterface } from '../interfaces';
import { DashboardDto, WidgetSettingDto } from '../dto';
import { WidgetTypeEnum } from '../enums';
import { SizeValueEnum, ViewTypeValueEnum } from '../enums/wigdet-setting-type-values';

export class WidgetDto implements WidgetInterface {
  @ApiPropertyOptional()
  @IsString()
  public name: string;

  @ApiPropertyOptional()
  @IsString()
  public size: SizeValueEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(WidgetTypeEnum)
  public type: WidgetTypeEnum;

  @ApiProperty()
  @ValidateNested()
  @IsNotEmpty()
  public dashboard: DashboardDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ViewTypeValueEnum)
  public viewType: ViewTypeValueEnum;

  @ApiProperty()
  @IsNotEmpty()
  public widgetSettings: WidgetSettingDto[] | WidgetSettingDto[][] | WidgetSettingDto[][][];
}
