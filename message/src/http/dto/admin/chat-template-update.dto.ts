import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ChatTemplateUpdateHttpRequestDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public description: string;
}
