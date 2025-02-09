import { IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { SynchronizationTasKindEnum } from '../enums/synchronization-task-kind.enum';
import { FileImportDto } from './file-import.dto';

export class SynchronizationTaskDto {
  @IsString()
  @IsIn([SynchronizationTasKindEnum.FileImport])
  public kind: SynchronizationTasKindEnum;

  @ValidateNested()
  public fileImport?: FileImportDto;
}
