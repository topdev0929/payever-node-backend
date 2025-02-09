import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostStateErrorDto {
  @ApiProperty()
  @IsNumber()
  public code: number;

  @ApiProperty()
  @IsString()
  public error: string;

  @ApiProperty()
  @IsString()
  public message: string;
}
