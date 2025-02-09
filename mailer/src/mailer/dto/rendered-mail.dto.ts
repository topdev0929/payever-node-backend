import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AttachmentInterface } from '../interfaces/attachment.interface';

export class RenderedMailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public subject: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public html: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  public attachments: AttachmentInterface[];
}
