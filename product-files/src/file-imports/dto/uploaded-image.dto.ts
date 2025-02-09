import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UploadedImageDto {
  @IsString()
  @IsNotEmpty()
  public originalName: string;

  @IsString()
  @IsUrl({ require_protocol: true })
  @IsNotEmpty()
  public url: string;
}
