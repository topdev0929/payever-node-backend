import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { ArgumentMediaContainerEnum } from '../enum';

export class ImageUploadFromUrlRequest {
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @IsString()
  @IsNotEmpty()
  public url: string;

  @IsString()
  @IsNotEmpty()
  public container: ArgumentMediaContainerEnum;

  @IsBoolean()
  public compress: boolean;

  @IsBoolean()
  public generateThumbnail: boolean;

  @IsString()
  public blobName?: string;
}
