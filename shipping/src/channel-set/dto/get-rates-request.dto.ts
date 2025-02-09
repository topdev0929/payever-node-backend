import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDefined, ValidateNested } from 'class-validator';
import { ShippingProductItemDto } from '../../shipping/dto/shipping-product-item.dto';
import { Type } from 'class-transformer';
import { AddressDto } from '../../shipping/dto';

export class GetRatesRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @ValidateNested()
  @Type(() => AddressDto)
  public shippingAddress: AddressDto;

  @ApiProperty({ type: [ShippingProductItemDto] })
  @IsNotEmpty()
  @IsDefined()
  @ValidateNested()
  @Type(() => ShippingProductItemDto)
  public shippingItems: ShippingProductItemDto[];
}
