import { IsNotEmpty, IsString, IsNumber, IsDateString, IsArray } from 'class-validator';

export class PaymentEventItemDto {
  @IsNotEmpty()
  @IsDateString()
  public created_at: Date;

  @IsArray()
  public extra_data?: any[];

  @IsString()
  public identifier?: string;

  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsArray()
  public options?: any[];

  @IsNotEmpty()
  @IsNumber()
  public price: number;

  @IsNumber()
  public price_net?: number;

  @IsString()
  public product_uuid?: string;

  @IsNotEmpty()
  @IsNumber()
  public quantity: number;

  @IsString()
  public sku?: string;

  @IsDateString()
  public updated_at: Date;

  @IsNotEmpty()
  @IsString()
  public uuid: string;

  @IsNumber()
  public vat_rate?: number;
}
