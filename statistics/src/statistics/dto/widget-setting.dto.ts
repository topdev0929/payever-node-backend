import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { WidgetSettingTypeEnum } from '../enums';
import { WidgetSettingInterface } from '../interfaces';

export class WidgetSettingDto implements WidgetSettingInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(WidgetSettingTypeEnum)
  public type: WidgetSettingTypeEnum;

  @ApiProperty()
  @IsNotEmpty()
  public value: any;
}
