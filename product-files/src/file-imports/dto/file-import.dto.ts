import { IsNotEmpty, IsUrl, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UploadedImageDto } from './uploaded-image.dto';

export class FileImportDto {
  @IsNotEmpty()
  @IsUrl({ require_protocol: true })
  public fileUrl: string;

  @IsOptional()
  @IsBoolean()
  public overwriteExistent?: boolean;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UploadedImageDto)
  public uploadedImages?: UploadedImageDto[];
}
