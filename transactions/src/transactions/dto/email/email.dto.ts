import { Exclude, Expose, Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';
import { EmailAttachmentDto } from './email-attachment.dto';

@Exclude()
export class EmailDto {
  @IsString()
  @Expose()
  public to: string;

  @IsString()
  @Expose()
  public cc: string;

  @IsString()
  @Expose()
  public subject: string;

  @IsString()
  @Expose()
  public html: string;

  @IsArray()
  @Type(() => EmailAttachmentDto)
  @Expose()
  public attachments: EmailAttachmentDto[] = [];
}
