import { ProcessShippingOrderDto, ShipGoodsDto } from '../dto';

export class ProcessShipingOrderDtoConverter {
  public static fromShipGoodsDto(shipGoodsDto: ShipGoodsDto): ProcessShippingOrderDto {
    return {
      businessName: shipGoodsDto.businessName,
      shippedAt: shipGoodsDto.shippedAt,
      transactionId: shipGoodsDto.transactionId,
    } as ProcessShippingOrderDto;
  }
}
