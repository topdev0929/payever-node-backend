import { IsArray, IsEmail, IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';
import * as Mail from 'nodemailer/lib/mailer';

import { environment } from '../../../environments';
import { AttachmentDto } from './attachment.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ServerTypeEnum } from '../../enum';
import { MailServerConfigInterface } from '../../interfaces';

export class MailDto implements Mail.Options {
  @IsNotEmpty()
  @IsString()
  public from: string = environment.from;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public to: string;

  @IsOptional()
  @IsObject()
  public headers: any;

  @IsOptional()
  @IsString()
  @IsEmail()
  replyTo?: string;

  @IsString({ each: true })
  public cc: string[] = [];

  @IsString({ each: true })
  public bcc: string[] = [];

  @IsNotEmpty()
  @IsString()
  public subject: string;

  @IsNotEmpty()
  @IsString()
  public html: string;

  @IsArray()
  public attachments: AttachmentDto[] = [];

  @ApiProperty()
  @IsOptional()
  public serverType?: ServerTypeEnum;

  @ApiProperty()
  @IsOptional()
  public serverConfig: MailServerConfigInterface;

  public attachFiles(files: AttachmentDto[]): void {
    for (const file of files) {
      this.attachments.push(file);
    }
  }
}
