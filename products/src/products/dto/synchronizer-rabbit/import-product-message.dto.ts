import { IsDefined, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessReferenceDto } from '../business-reference.dto';
import { SynchronizationTaskReferenceDto } from '../synchronization-task-reference.dto';
import { ImportProductDto } from '../import-product';

export class ImportProductMessageDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SynchronizationTaskReferenceDto)
  public synchronizationTask?: SynchronizationTaskReferenceDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => ImportProductDto)
  public payload: ImportProductDto;
}
