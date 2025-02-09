import { FileImportDto } from './file-import.dto';
import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessReferenceDto } from './business-reference.dto';
import { SynchronizationTaskReferenceDto } from './synchronization-task-reference.dto';

export class FileImportTriggeredEventDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => SynchronizationTaskReferenceDto)
  public synchronization: SynchronizationTaskReferenceDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => FileImportDto)
  public fileImport: FileImportDto;
}
