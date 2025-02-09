import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDefined, IsString } from 'class-validator';

export class ShipGoodsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  public shippingOrderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  public businessName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  public transactionId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  public shippedAt: string;
}
