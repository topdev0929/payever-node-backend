import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

/**
 * This DTO presents api cart item with all three possible identities:
 * uuid - ID from Payever Products application
 * identifier - ID from outer system (can be used for SKU)
 * sku - SKU from outer system
 */
export class CartItemDto {
  @IsString()
  public id: string;

  @IsString()
  @IsOptional()
  public uuid: string;

  @IsString()
  @IsOptional()
  public identifier: string;

  @IsString()
  @IsOptional()
  public sku: string;

  @IsNumber()
  @IsPositive()
  public quantity: number;
}
