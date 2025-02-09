import { IsBoolean, IsString, IsUrl, IsArray } from 'class-validator';
import { UploadedImageDto } from './uploaded-image.dto';

export class FileImportDto {
  @IsString()
  @IsUrl()
  public fileUrl: string;

  @IsBoolean()
  public overwriteExisting: boolean;

  @IsArray()
  public uploadedImages?: UploadedImageDto[];
}
