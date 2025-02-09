import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { WallPaperThemeEnum } from '../enum';

export class MediaUploadResultDto {
  @IsString()
  @IsNotEmpty()
  public sourceUrl: string;
  @IsString()
  @IsOptional()
  public previewUrl: string;
  @IsString()
  @IsOptional()
  public brightness?: WallPaperThemeEnum;
}
