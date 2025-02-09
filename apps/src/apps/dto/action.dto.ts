import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString, IsOptional, IsNotEmpty } from 'class-validator';

import { ActionMethodEnum } from '../enums';

export class ActionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  public description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ActionMethodEnum)
  public method: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public roles: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public url: string;
}
