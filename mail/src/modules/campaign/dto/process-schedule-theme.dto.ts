import { IsNotEmpty, IsString } from 'class-validator';

export class ProcessScheduleThemeDto {
  @IsString()
  @IsNotEmpty()
  public themeId: string;
}

