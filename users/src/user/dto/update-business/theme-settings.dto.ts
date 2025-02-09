import { IsNotEmpty, IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { ThemeEnum } from '../../enums';

export class ThemeSettingsDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public primaryColor?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public secondaryColor?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public primaryTransparency?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public secondaryTransparency?: string;

  @IsOptional()
  @IsEnum(ThemeEnum)
  public theme?: string;

  @IsBoolean()
  @IsOptional()
  public auto?: boolean = false;
}
