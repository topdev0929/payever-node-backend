import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { ENCODING_TYPE_BASE_64 } from '../../constants';

@Exclude()
export class EmailAttachmentDto {
  @IsString()
  @Expose()
  public filename: string;

  @IsString()
  @Expose()
  public content: string;

  @IsString()
  @Expose()
  public encoding: string = ENCODING_TYPE_BASE_64;
}
