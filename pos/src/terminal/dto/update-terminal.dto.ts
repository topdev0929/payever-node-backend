import { ApiProperty } from '@nestjs/swagger';
import { IsLanguage, IsLanguagesList } from '@pe/common-sdk';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTerminalDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public name?: string;

  @ApiProperty()
  @IsOptional()
  public logo?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public active?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public default?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsLanguage()
  public defaultLocale?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsLanguagesList()
  public locales?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  public phoneNumber?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public message?: string;
}
