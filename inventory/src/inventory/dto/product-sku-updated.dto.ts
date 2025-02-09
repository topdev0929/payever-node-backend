import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { BusinessReferenceDto } from './rmq';
import { Type } from 'class-transformer';

export class ProductSkuUpdatedDto {
  @IsString()
  @IsNotEmpty()
  public originalSku: string;

  @IsString()
  @IsNotEmpty()
  public updatedSku: string;

  @ValidateNested()
  @IsDefined()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;
}
