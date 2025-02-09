import { IsString, IsNotEmpty, IsOptional, ValidateNested, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SingleMailAttachmentDto } from './single-mail-attachment.dto';
import { ServerTypeEnum } from '../enum';

export class SingleMailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public to: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  public cc: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ValidateIf((self: SingleMailDto) => !self.type)
  public subject: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public language: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((self: SingleMailDto) => !self.type)
  public html: string;

  @ApiProperty()
  @IsOptional()
  public params: object;

  @ApiProperty()
  @IsOptional()
  @Type(() => SingleMailAttachmentDto)
  @ValidateNested({
    each: true,
  })
  public attachments: SingleMailAttachmentDto[];

  @ApiProperty()
  @IsOptional()
  public server_type?: ServerTypeEnum;

}
