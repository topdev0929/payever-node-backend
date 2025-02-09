import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttachmentInterface } from '../interfaces';

export class SendEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  public to: string[];

  @ApiProperty()
  @IsString()
  public from: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public subject: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public html: string;

  @ApiProperty()
  @IsOptional()
  public attachments?: AttachmentInterface[];
}
