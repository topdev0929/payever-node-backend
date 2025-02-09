import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';
import { LocalDeliveryInterface } from '../interfaces';
import { ShippingOriginInterface } from '../interfaces/shipping-origin.interface';

export class LocalDeliveryDto implements LocalDeliveryInterface {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public id?: string;
  
  @ApiPropertyOptional()
  @IsOptional()
  public shippingOrigin: ShippingOriginInterface | string;
  
  @ApiProperty()
  @IsNumber()
  public deliveryRadius: number;

  @ApiProperty()
  public postalCodes: string[];

  @ApiProperty()
  @IsNumber()
  public minOrderPrice: number;

  @ApiProperty()
  @IsNumber()
  public deliveryPrice: number;

  @ApiProperty()
  @IsString()
  public deliveryMessage: string;
}
