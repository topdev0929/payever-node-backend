import { IsDefined, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { SynchronizationTaskIdReferenceDto } from '@pe/synchronizer-kit';

import { SynchronizationTaskErrorDto } from './embedded/synchronization-task-error.dto';
import { ImportedSummaryItemDto } from './embedded/imported-summary-item.dto';

export class ImportSuccessDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => SynchronizationTaskIdReferenceDto)
  public synchronization: SynchronizationTaskIdReferenceDto;

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true})
  @Type(() => SynchronizationTaskErrorDto)
  public errors: SynchronizationTaskErrorDto[];

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true})
  @Type(() => ImportedSummaryItemDto)
  public items: ImportedSummaryItemDto[];
}
