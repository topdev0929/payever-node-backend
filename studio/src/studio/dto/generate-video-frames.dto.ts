import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GenerateVideoFramesDto {
  @ApiProperty()
  @IsString()
  public videoPath: string;
}
