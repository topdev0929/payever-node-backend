import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SynchronizationTaskIdReferenceDto } from '../';
import { FailureReasonDto } from './failure-reason.dto';

export class ImportFailedDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => SynchronizationTaskIdReferenceDto)
  public synchronization: SynchronizationTaskIdReferenceDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => FailureReasonDto)
  public data: FailureReasonDto;
}
