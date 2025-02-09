import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EventAttachmentDto {
  @ApiProperty()
  @IsString()
  public filename: string;

  @ApiProperty()
  public content: string | Buffer;

  @IsString()
  public encoding: string;
}
