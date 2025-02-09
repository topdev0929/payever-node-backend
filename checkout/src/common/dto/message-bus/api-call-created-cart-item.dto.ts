import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ApiCallCreatedCartItemAttributesDto } from './api-call-created-cart-item-attributes.dto';
import { CartItemTypeEnum } from '../../../common/enum';

@Exclude()
export class ApiCallCreatedCartItemDto {
  @ApiProperty()
  @IsString()
  @Expose()
  public description: string;

  @ApiProperty()
  @Expose({ name: 'extra_data' })
  public extraData: any;

  @ApiProperty()
  @IsString()
  @Expose()
  public identifier: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public name: string;

  @ApiProperty()
  @IsNumber()
  @Expose()
  public price: number;

  @ApiProperty()
  @IsNumber()
  @Expose({ name: 'price_netto' })
  public priceNetto: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  public quantity: number;

  @ApiProperty()
  @IsString()
  @Expose()
  public sku: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public thumbnail: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public url: string;

  @ApiProperty()
  @IsNumber()
  @Expose({ name: 'vat_rate' })
  public vatRate: number;

  @ApiProperty()
  @IsString()
  @Expose()
  public brand: string;

  @ApiProperty()
  @IsNumber()
  @Expose({ name: 'total_amount' })
  public totalAmount: number;

  @ApiProperty()
  @IsNumber()
  @Expose({ name: 'total_tax_amount' })
  public totalTaxAmount: number;

  @ApiProperty()
  @IsNumber()
  @Expose({ name: 'total_discount_amount' })
  public totalDiscountAmount: number;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'image_url' })
  public imageUrl: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'product_url' })
  public productUrl: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public category: string;

  @ApiProperty()
  @Type(() => ApiCallCreatedCartItemAttributesDto)
  @Expose()
  public attributes?: ApiCallCreatedCartItemAttributesDto;

  @ApiProperty()
  @IsEnum(CartItemTypeEnum)
  @Expose()
  public type: CartItemTypeEnum;
}
