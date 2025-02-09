import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsLocale,
  IsISO31661Alpha2,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ActionDto } from './action.dto';
import { LinkDto } from './link.dto';
import { ConnectDto } from './connect.dto';
import { ScopesEnum } from '../enums';

export class UpdateAppDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public icon?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public image?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsISO31661Alpha2({ each: true })
  public countryList?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public price?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public developer?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsLocale({ each: true })
  public languages?: string[];

  @ApiProperty({ required: false, type: [LinkDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  public links?: LinkDto[];

  @ApiProperty({ required: false, type: [ActionDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ActionDto)
  public actions?: ActionDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(ScopesEnum, { each: true })
  public scopes?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public enabled?: boolean;

  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => ConnectDto)
  public connect?: ConnectDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public redirectionUrls?: string[];
}
