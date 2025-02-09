import { IsString, IsNotEmpty } from 'class-validator';
import { ImportedItemTypesEnum } from '../enums';

export class ImportedSummaryItemDto {
  @IsString()
  @IsNotEmpty()
  public sku: string;

  @IsString()
  @IsNotEmpty()
  public type: ImportedItemTypesEnum;
}
