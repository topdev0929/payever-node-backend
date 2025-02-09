import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { BusinessReferenceDto } from './rmq';
import { Type } from 'class-transformer';

export class ProductSkuRemovedDto {
  @IsString()
  @IsNotEmpty()
  public sku: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;
}
