import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';
import { TutorialDto } from './tutorial.dto';
import { WidgetInterface } from '../../interfaces';
import { IsUniqueWidgetType } from '../../validators';

export class CreateWidgetDto implements WidgetInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUniqueWidgetType()
  public type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public icon: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public default: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public helpURL: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => TutorialDto)
  public tutorial: TutorialDto;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public order: number;
}
