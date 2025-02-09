import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { VideoCutDto } from '.';

export class GenerateRandomVideoDto {
  @ApiProperty()
  @IsNumber()
  public errorMargin: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VideoCutDto)
  public videoCutOptions: VideoCutDto[];

  @ApiProperty()
  @IsString()
  public audio: string;
}
