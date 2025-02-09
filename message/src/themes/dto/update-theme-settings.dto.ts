import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsOptional,
  IsHexColor,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateThemeSettingCustomPersetColorsDto } from './update-theme-settings-custom-preset-colors.dto';

export class UpdateThemeSettingDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsHexColor()
  @IsOptional()
  public bgChatColor: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsHexColor()
  @IsOptional()
  public accentColor: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsHexColor()
  @IsOptional()
  public messagesTopColor: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsHexColor()
  @IsOptional()
  public messagesBottomColor: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public headerBanner: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public pageBackground: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsHexColor()
  @IsOptional()
  public messageAppColor: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public messageWidgetShadow: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  public defaultPresetColor: number;

  @ApiProperty({
    isArray: true,
    required: false,
    type: UpdateThemeSettingCustomPersetColorsDto,
  })
  @Type(() => UpdateThemeSettingCustomPersetColorsDto)
  @ValidateNested({ each: true })
  @IsOptional()
  public customPresetColors: UpdateThemeSettingCustomPersetColorsDto[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public messageWidgetBlurValue: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public alwaysOpen?: boolean;
}
