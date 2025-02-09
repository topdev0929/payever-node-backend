import { IsNotEmpty, IsString } from 'class-validator';

export class CheckoutDto {
  @IsNotEmpty()
  @IsString()
  public _id: string;

}
