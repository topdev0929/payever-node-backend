import { InventoryDto } from './inventory.dto';
import { Type } from 'class-transformer';
import { ValidateNested, IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { SynchronizationTaskReferenceDto } from '../synchronization-task-reference.dto';

export class InventoryEventInventorySynchronizationFailedDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => InventoryDto)
  public inventory: InventoryDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => SynchronizationTaskReferenceDto)
  public synchronizationTask: SynchronizationTaskReferenceDto;

  @IsString()
  @IsNotEmpty()
  public errorMessage: string;
}
