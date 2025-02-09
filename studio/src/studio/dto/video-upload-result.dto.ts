import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MediaUploadResultDto {
  @IsString()
  @IsNotEmpty()
  public sourceUrl: string;

  @IsString()
  @IsOptional()
  public previewUrl: string;
}
