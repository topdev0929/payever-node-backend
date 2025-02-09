import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreatePaymentItemDto {
  @IsOptional()
  @IsString()
  @Expose()
  public description?: string;
  
  @IsOptional()
  @Expose()
  public extra_data?: { } = { };
  
  @IsOptional()
  @IsString()
  @Expose()
  public identifier?: string;
  
  @IsNotEmpty()
  @IsString()
  @Expose()
  public name: string;
  
  @IsOptional()
  @Expose()
  public options?: { } = { };
  
  @IsNotEmpty()
  @IsNumber()
  @Expose()
  public price: number;
  
  @IsOptional()
  @IsNumber()
  @Expose()
  public price_net?: number;
  
  @IsOptional()
  @IsString()
  @Expose()
  public product_id?: string;
  
  @IsNotEmpty()
  @IsInt()
  @Min(1, )
  @Expose()
  public quantity: number;
  
  @IsOptional()
  @IsString()
  @Expose()
  public sku?: string;
  
  @IsOptional()
  @IsString()
  @Expose()
  public thumbnail?: string;
  
  @IsOptional()
  @IsNumber()
  @Expose()
  public vat_rate?: number;
  
  @IsOptional()
  @IsString()
  @Expose()
  public url?: string;
}
