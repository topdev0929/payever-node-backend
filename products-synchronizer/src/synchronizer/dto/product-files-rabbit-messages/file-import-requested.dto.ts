import { IsDefined, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { FileImportDto } from '@pe/synchronizer-kit';

export class FileImportRequestedDto {
  @IsDefined()
  @IsString()
  public businessId: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => FileImportDto)
  public fileImport: FileImportDto;
}
