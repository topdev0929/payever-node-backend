import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsString,
  IsISO31661Alpha2,
  IsLocale,
  IsOptional,
  IsNotEmpty,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { DoesCategoryExists } from '../constraints';
import { EventsEnum, ScopesEnum } from '../enums';
import { ActionDto } from './action.dto';
import { LinkDto } from './link.dto';
import { ConnectDto } from './connect.dto';

export class CreateAppDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public key: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @DoesCategoryExists()
  public category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiProperty({ required: true })
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
  public countryList: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public price: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public developer: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsLocale({ each: true })
  public languages: string[];

  @ApiProperty({ required: false, type: [LinkDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  public links: LinkDto[];

  @ApiProperty({ required: false, type: [ActionDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ActionDto)
  public actions?: ActionDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(EventsEnum, { each: true })
  public events?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(ScopesEnum, { each: true })
  public scopes?: string[];

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => ConnectDto)
  public connect: ConnectDto;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  public appUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public redirectionUrls: string[] = [];
}
