import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested, IsDateString } from 'class-validator';
import { CartItemDto } from '../../apps/products-app/dto/cart-item.dto';

export class TransactionPaymentAddDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @ValidateNested()
  public business: BusinessInerface;

  public customer: {
    email: string;
    name: string;
  };

  public user: {
    id: string;
  };

  @IsNotEmpty()
  @ValidateNested()
  public channel_set: ChannelSetInterface;

  @IsNumber()
  @IsNotEmpty()
  public amount: number;

  @IsDateString()
  public date: string;

  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  public items: CartItemDto[];

  @IsDateString()
  public last_updated: string;

}

interface ChannelSetInterface {
  id: string;
}

interface BusinessInerface {
  id: string;
}
