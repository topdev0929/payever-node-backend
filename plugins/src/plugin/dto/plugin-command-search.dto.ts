import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PluginCommandSearchDto {
  @ApiProperty({
    description: 'Unix timestamp',
  })
  @IsOptional()
  @IsNumber()
  public from?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public channelType?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public cmsVersion?: string;
}
