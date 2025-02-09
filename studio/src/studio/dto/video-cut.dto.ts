import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class VideoCutDto {
  @ApiProperty()
  @IsString()
  public video: string;
  
  @ApiProperty()
  @IsNumber()
  public duration: number;
  
  @ApiProperty()
  @IsNumber()
  public noClips: number;
}
