import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { OrderCartItemAttributesIncomingDto } from './order-cart-item-attributes-incoming.dto';

@Exclude()
export class OrderCartItemIncomingDto {
  @ApiProperty()
  @IsString()
  @Expose()
  public identifier: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public name: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public brand?: string;

  @ApiProperty()
  @IsNumber()
  @Expose()
  public quantity: number;

  @ApiProperty()
  @IsString()
  @Expose()
  public sku?: string;

  @ApiProperty()
  @IsNumber()
  @Expose()
  public unit_price: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  public tax_rate?: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  public total_amount: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  public total_tax_amount?: number;

  @ApiProperty()
  @IsString()
  @Expose()
  public description?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public image_url?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public product_url?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public category?: string;

  @ApiProperty()
  @Type(() => OrderCartItemAttributesIncomingDto)
  @Expose()
  public attributes?: OrderCartItemAttributesIncomingDto;
}
