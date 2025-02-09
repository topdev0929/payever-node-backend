import { Type } from 'class-transformer';
import { IsString, IsNumber, ValidateNested, IsDefined } from 'class-validator';
import { BusinessDto } from '../business.dto';

export class InventoryEventStockSubtractedDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => BusinessDto)
  public business: BusinessDto;
  @IsString()
  public sku: string;
  @IsNumber()
  public quantity: number;
  @IsNumber()
  public stock: number;
}
