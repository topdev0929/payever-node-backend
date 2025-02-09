import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ThemeSettingsDto } from '../../business/dto';

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @ValidateNested()
  @Type(() => ThemeSettingsDto)
  public themeSettings: ThemeSettingsDto;
}
