import { IsString, IsDefined, IsBoolean, IsArray, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { OnboardingTypeEnum } from '../enums';
import { OnboardingInterface } from '../interfaces';
import { ActionDto } from './action.dto';
import { FormFieldDto } from './form-field.dto';

export class OnboardingDto implements OnboardingInterface {
  @ApiProperty({ required: false })
  public _id?: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  public name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  public logo: string;

  @ApiProperty({ required: true })
  @IsEnum(OnboardingTypeEnum)
  @IsDefined()
  public type: OnboardingTypeEnum;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  public wallpaperUrl: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public defaultBusinessWallpaper?: string;

  @Type(() => ActionDto)
  @ApiProperty({ type: () => ([ActionDto]), required: false})
  @IsOptional()
  public afterLogin?: ActionDto[];

  @Type(() => ActionDto)
  @ApiProperty({ type: () => ([ActionDto]), required: false})
  @IsOptional()
  public afterRegistration?: ActionDto[];

  @Type(() => FormFieldDto)
  @ApiProperty({ type: () => ([FormFieldDto]), required: false})
  @IsOptional()
  public form?: FormFieldDto[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  public accountFlags?: any;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public redirectUrl?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public defaultLoginByEmail?: boolean;
}
