import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SingleMailAttachmentDto {
  @ApiProperty()
  @IsString()
  public filename: string;

  @ApiProperty()
  public content: string | ReturnType<Buffer['toJSON']>;

  @ApiProperty()
  @IsString()
  public contentType: string;

  @ApiProperty()
  @IsString()
  public encoding: string;
}
