import { IsNotEmpty, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { FileImportDto } from './file-import.dto';

export class FileImportRequestedDto {
  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FileImportDto)
  public fileImport: FileImportDto;
}
