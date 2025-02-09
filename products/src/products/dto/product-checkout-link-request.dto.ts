// tslint:disable max-classes-per-file
import { IsNotEmpty, IsArray, IsString } from 'class-validator';

export class ProductCheckoutLinkRequestDto {
  @IsArray()
  @IsNotEmpty()
  public productIds: string[];

  @IsString()
  @IsNotEmpty()
  public type: string;
}
