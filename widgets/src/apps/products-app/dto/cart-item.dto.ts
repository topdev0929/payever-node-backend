import { CartItemInterface } from '../interfaces';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CartItemDto implements CartItemInterface {
  @IsString()
  @IsNotEmpty()
  public _id: string;

  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  public identifier: string;

  @IsString()
  @IsNotEmpty()
  public thumbnail: string;

  @IsNumber()
  public price: number;

  @IsNumber()
  public price_net: number;

  @IsNumber()
  public vat_rate: number;

  @IsNumber()
  public quantity: number;
}
