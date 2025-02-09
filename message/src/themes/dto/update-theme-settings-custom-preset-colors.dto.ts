import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsHexColor,
} from 'class-validator';

export class UpdateThemeSettingCustomPersetColorsDto {
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
  public messagesBottomColor: string;
}
