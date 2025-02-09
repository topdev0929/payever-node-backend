import { IsString, IsNotEmpty } from 'class-validator';

export class ProductSkuReferenceDto {
  @IsString()
  @IsNotEmpty()
  public sku: string;
}
