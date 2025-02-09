import {
  IsString,
  Validate,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Attachment } from 'nodemailer/lib/mailer';
import { IsStringOrBuffer } from '../../validators';


export class AttachmentDto implements Attachment {
  @ApiProperty()
  @IsString()
  public uuid: string;

  @IsString()
  @ApiProperty()
  public filename: string;

  @Validate(IsStringOrBuffer)
  @ApiProperty()
  public content: string | Buffer;

  @IsString()
  @ApiProperty()
  @IsOptional()
  public path: string;

  @IsString()
  @ApiProperty()
  public cid: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public contentType?: string;

  @ApiProperty()
  @IsString()
  public encoding?: string;
}
