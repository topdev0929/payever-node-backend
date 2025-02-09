import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class GenerateVideoByTagDto {
  @IsArray()
  @Type(() => String)
  public tags: string[];

  @ApiProperty()
  @IsNumber()
  public duration: number;

  @ApiProperty()
  @IsString()
  public audio: string;
}
