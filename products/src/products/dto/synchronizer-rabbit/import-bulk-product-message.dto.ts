import { IsDefined, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessReferenceDto } from '../business-reference.dto';
import { SynchronizationTaskReferenceDto } from '../synchronization-task-reference.dto';
import { ImportProductDto } from '../import-product';

export class ImportBulkProductMessageDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SynchronizationTaskReferenceDto)
  public synchronization?: SynchronizationTaskReferenceDto;

  @IsDefined()
  public payload: ImportProductDto[];
}
