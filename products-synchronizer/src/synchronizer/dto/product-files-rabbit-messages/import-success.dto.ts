import { IsDefined, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { SynchronizationTaskErrorDto, SynchronizationTaskIdReferenceDto } from '../';
import { ImportedSummaryItemDto } from '../imported-summary-item.dto';

export class ImportSuccessDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => SynchronizationTaskIdReferenceDto)
  public synchronization: SynchronizationTaskIdReferenceDto;

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SynchronizationTaskErrorDto)
  public errors: SynchronizationTaskErrorDto[];

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportedSummaryItemDto)
  public items: ImportedSummaryItemDto[];
}
