import { IsNotEmpty, IsString } from 'class-validator';

export class CheckoutChannelSetCreatedDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public checkout: string;
}
