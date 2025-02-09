import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ImportedItemTypesEnum } from '../enums';
import { SynchronizationTaskModel } from '@pe/synchronizer-kit';

export class SynchronizationTaskItemDto {
  @IsString()
  @IsNotEmpty()
  public task: SynchronizationTaskModel | string;

  @IsString()
  @IsNotEmpty()
  public sku: string;

  @IsString()
  @IsNotEmpty()
  public type: ImportedItemTypesEnum;

  @IsBoolean()
  @IsOptional()
  public isProcessed?: boolean;
}
