import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PluginCommandNameEnum } from '../enums';

export class PluginCommandDto {
  @ApiProperty({ enum: PluginCommandNameEnum })
  @IsEnum(PluginCommandNameEnum)
  public name: PluginCommandNameEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public value: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public channelType?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public minCmsVersion?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public maxCmsVersion?: string;

  @ApiProperty()
  @IsOptional()
  public metadata?: { };
}
