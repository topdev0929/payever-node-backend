import { InventoryDto } from './inventory.dto';
import { Type } from 'class-transformer';
import { ValidateNested, IsDefined } from 'class-validator';
import { SynchronizationTaskReferenceDto } from '../synchronization-task-reference.dto';

export class InventoryEventInventorySynchronizationSucceededDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => InventoryDto)
  public inventory: InventoryDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => SynchronizationTaskReferenceDto)
  public synchronizationTask: SynchronizationTaskReferenceDto;
}
