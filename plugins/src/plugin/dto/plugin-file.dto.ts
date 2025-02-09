import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class PluginFileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  public filename: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public version: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public minCmsVersion: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public maxCmsVersion: string;
}
