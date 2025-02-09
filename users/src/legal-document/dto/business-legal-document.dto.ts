import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class BusinessLegalDocumentDto {
  @ApiProperty()
  @IsString()
  @Transform((value: string) => sanitizeHtml(value).trim())
  public content: string;
}
