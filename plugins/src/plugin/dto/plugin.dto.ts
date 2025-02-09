import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PluginDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public documentation: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public marketplace: string;

  @ApiProperty()
  @IsOptional()
  public pluginFiles: object[];
}
