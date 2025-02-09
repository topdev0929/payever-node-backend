import { BusinessReferenceDto } from './business-reference.dto';
import { IsDefined, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StockChangedDto {
  @ValidateNested()
  @IsDefined()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;

  @IsString()
  @IsNotEmpty()
  public sku: string;

  @IsNumber()
  public quantity: number;
}
