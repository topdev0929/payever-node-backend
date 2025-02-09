import { IsString } from 'class-validator';

export class InventoryDto {
  @IsString()
  public sku: string;
}
