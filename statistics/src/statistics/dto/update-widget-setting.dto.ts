import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';
import { WidgetSettingDto } from '../dto';

export class UpdateWidgetSettingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  public widgetSettings: WidgetSettingDto[] | WidgetSettingDto[][] | WidgetSettingDto[][][];
}
