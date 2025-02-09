import { BusinessReferenceDto } from './business-reference.dto';
import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { SynchronizationTaskReferenceDto } from './synchronization-task-reference.dto';

export class StockSyncDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;

  @IsString()
  @IsNotEmpty()
  public sku: string;

  @IsNumber()
  @IsOptional()
  public stock?: number;

  @IsOptional()
  @IsBoolean()
  public isNegativeStockAllowed?: boolean = false;

  @IsString()
  @IsOptional()
  public origin: string = 'commerceos';

  @IsOptional()
  @ValidateNested()
  @Type(() => SynchronizationTaskReferenceDto)
  public synchronizationTask?: SynchronizationTaskReferenceDto;
}
