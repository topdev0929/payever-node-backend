import { IsString, IsNotEmpty } from 'class-validator';
import { ImportedItemTypesEnum } from '@pe/synchronizer-kit';

export class ImportedSummaryItemDto {
  @IsString()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public type: ImportedItemTypesEnum;
}
