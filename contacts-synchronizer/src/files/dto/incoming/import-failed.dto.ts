import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SynchronizationTaskIdReferenceDto } from '@pe/synchronizer-kit';

import { FailureReasonDto } from './embedded/failure-reason.dto';

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
