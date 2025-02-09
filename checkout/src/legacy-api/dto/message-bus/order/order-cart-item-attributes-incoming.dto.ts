import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { OrderCartItemAttributesDimensionsIncomingDto } from './order-cart-item-attributes-dimensions-incoming.dto';

@Exclude()
export class OrderCartItemAttributesIncomingDto {
  @ApiProperty()
  @IsNumber()
  @Expose()
  public weight?: number;

  @ApiProperty()
  @Type(() => OrderCartItemAttributesDimensionsIncomingDto)
  @Expose()
  public dimensions?: OrderCartItemAttributesDimensionsIncomingDto;
}
