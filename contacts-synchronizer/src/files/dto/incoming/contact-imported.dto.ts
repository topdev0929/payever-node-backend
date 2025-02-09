import { ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { SynchronizationTaskIdReferenceDto } from '@pe/synchronizer-kit';

import { ContactDto } from '../../../synchronizer/dto/contacts';

export class ContactParsedRowDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => SynchronizationTaskIdReferenceDto)
  public synchronization: SynchronizationTaskIdReferenceDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => ContactDto)
  public data: ContactDto;
}
