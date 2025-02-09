import { IsNotEmpty, IsString } from 'class-validator';
import { ThemesEnum } from '../enums';

export class ThemeSettingsDto {
  @IsString()
  @IsNotEmpty()
  public theme: ThemesEnum;
}
