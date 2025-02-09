import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MediaDto {
  @IsString()
  @ApiProperty()
  public contentType: string;
  
  @IsString()
  @ApiProperty()
  public url: string;
}
