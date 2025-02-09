import { IsDefined, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessReferenceDto } from '../business-reference.dto';
import { SynchronizeTaskDto } from './synchronize-task.dto';

export class SynchronizeProductMessageDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => SynchronizeTaskDto)
  public synchronization: SynchronizeTaskDto;
}
